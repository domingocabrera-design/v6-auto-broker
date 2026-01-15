import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Stripe client
 * LOCKED to SDK-required version
 * DO NOT CHANGE unless Stripe SDK changes
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const { userId, lotNumber } = await req.json();

    if (!userId || !lotNumber) {
      return NextResponse.json(
        { error: "Missing userId or lotNumber" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;

    // ---------------------------------------------
    // 1. GET USER PLAN
    // ---------------------------------------------
    const { data: plan, error: planError } = await supabase
      .from("user_plans")
      .select("plan_name")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (planError || !plan) {
      console.error("❌ No plan found:", planError);
      return NextResponse.json({ error: "No plan found" }, { status: 400 });
    }

    // ---------------------------------------------
    // 2. CALCULATE BROKER FEE
    // ---------------------------------------------
    let brokerFee = 0;
    let breakdown: any = {};

    if (plan.plan_name === "Single Car") {
      brokerFee = 350;
      breakdown = {
        title_handling_processing: 150,
        broker_service_fee: 200,
      };
    } else {
      brokerFee = 250;
      breakdown = {
        title_handling_processing: 100,
        broker_service_fee: 150,
      };
    }

    // ---------------------------------------------
    // 3. GET USER DEPOSIT BALANCE
    // ---------------------------------------------
    const { data: deposit, error: depositError } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (depositError || !deposit) {
      return NextResponse.json(
        { error: "Deposit record not found" },
        { status: 400 }
      );
    }

    const availableDeposit =
      deposit.total_deposit - deposit.locked_deposit;

    // ---------------------------------------------
    // CASE 1: DEPOSIT COVERS THE FEE
    // ---------------------------------------------
    if (availableDeposit >= brokerFee) {
      console.log("🔵 Deducting broker fee from deposit…");

      await supabase.rpc("lock_deposit", {
        uid: userId,
        lot: lotNumber,
        amount: brokerFee,
      });

      await supabase.from("broker_fees").insert({
        user_id: userId,
        lot_number: lotNumber,
        broker_fee: brokerFee,
        paid_via: "deposit",
        status: "paid",
        breakdown,
      });

      return NextResponse.json({
        success: true,
        message: "Broker fee deducted from deposit",
      });
    }

    // ---------------------------------------------
    // CASE 2: NOT ENOUGH DEPOSIT → STRIPE INVOICE
    // ---------------------------------------------
    console.log("🟠 Deposit insufficient, creating Stripe invoice…");

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (userError || !userData?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Stripe customer ID missing" },
        { status: 400 }
      );
    }

    const stripeCustomerId = userData.stripe_customer_id;

    // Add invoice item
    await stripe.invoiceItems.create({
      customer: stripeCustomerId,
      amount: brokerFee * 100,
      currency: "usd",
      description: `Broker Fee for Lot ${lotNumber}`,
    });

    // Create and finalize the invoice
    const invoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      auto_advance: true,
    });

    // Save pending record
    await supabase.from("broker_fees").insert({
      user_id: userId,
      lot_number: lotNumber,
      broker_fee: brokerFee,
      paid_via: "stripe",
      stripe_invoice_id: invoice.id,
      status: "pending",
      breakdown,
    });

    return NextResponse.json({
      success: true,
      message: "Stripe invoice created",
    });

  } catch (err: any) {
    console.error("❌ PROCESS-FEE API ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}

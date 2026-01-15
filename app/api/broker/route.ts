import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    // ----------------------------------------------------
    // 1. GET USER PLAN
    // ----------------------------------------------------
    const { data: plan, error: planError } = await supabase
      .from("user_plans")
      .select("plan_name, plan_limit")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: "User plan not found" },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // 2. DETERMINE BROKER FEE
    // ----------------------------------------------------
    const brokerFee =
      plan.plan_name === "Single Car" ? 350 : 250;

    // ----------------------------------------------------
    // 3. GET DEPOSIT BALANCE
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // CASE 1 — Deposit covers the fee
    // ----------------------------------------------------
    if (availableDeposit >= brokerFee) {
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
      });

      return NextResponse.json({
        success: true,
        message: "Broker fee deducted from deposit",
      });
    }

    // ----------------------------------------------------
    // CASE 2 — Not enough deposit → Stripe invoice
    // ----------------------------------------------------
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (userError || !userData?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Stripe customer ID not found" },
        { status: 400 }
      );
    }

    // Create invoice item
    await stripe.invoiceItems.create({
      customer: userData.stripe_customer_id,
      amount: brokerFee * 100,
      currency: "usd",
      description: `Broker Fee for Lot ${lotNumber}`,
    });

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: userData.stripe_customer_id,
      auto_advance: true,
    });

    // Save pending broker fee
    await supabase.from("broker_fees").insert({
      user_id: userId,
      lot_number: lotNumber,
      broker_fee: brokerFee,
      paid_via: "stripe",
      stripe_invoice_id: invoice.id,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Stripe invoice created",
    });

  } catch (err: any) {
    console.error("❌ BROKER API ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}

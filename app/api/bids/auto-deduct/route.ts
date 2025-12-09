import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const bid = await req.json();

    const {
      id: bid_id,
      user_id,
      lot_number,
      final_price,
      fee_paid,
    } = bid;

    if (fee_paid) {
      console.log("Fee already paid — skipping.");
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // --------------------------
    // Get user plan
    // --------------------------
    const { data: plan } = await supabase
      .from("user_plans")
      .select("plan_name")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let brokerFee = 0;
    let breakdown = {};

    if (plan?.plan_name === "Single Car") {
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

    // --------------------------
    // Get deposit balance
    // --------------------------
    const { data: deposit } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", user_id)
      .single();

    const available =
      deposit.total_deposit - deposit.locked_deposit;

    // --------------------------
    // CASE 1: Deposit covers fee
    // --------------------------
    if (available >= brokerFee) {
      console.log("Deducting broker fee from deposit...");

      // lock fee
      await supabase.rpc("lock_deposit", {
        uid: user_id,
        lot: lot_number,
        amount: brokerFee,
      });

      // insert fee record
      await supabase.from("broker_fees").insert({
        user_id,
        lot_number,
        broker_fee: brokerFee,
        paid_via: "deposit",
        status: "paid",
        breakdown,
      });

      // update bid
      await supabase
        .from("bids")
        .update({ fee_paid: true })
        .eq("id", bid_id);

      return NextResponse.json({
        success: true,
        message: "Broker fee auto-deducted",
      });
    }

    // --------------------------
    // CASE 2: Not enough deposit → Stripe fallback
    // --------------------------
    console.log("Insufficient deposit — sending invoice instead.");

    await supabase
      .from("bids")
      .update({ fee_paid: false })
      .eq("id", bid_id);

    return NextResponse.json({
      success: true,
      message: "Insufficient deposit — use Stripe fallback",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

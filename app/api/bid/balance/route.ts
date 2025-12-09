import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  try {
    // ----- TOTAL DEPOSITS -----
    const { data: deposits, error: depErr } = await supabase
      .from("user_deposits")
      .select("amount");

    if (depErr) throw depErr;

    const totalDeposits =
      deposits?.reduce((sum: number, row: any) => sum + Number(row.amount), 0) ||
      0;

    // ----- ACTIVE BIDS -----
    const { data: activeBids, error: bidErr } = await supabase
      .from("user_bids")
      .select("max_bid, active")
      .eq("active", true);

    if (bidErr) throw bidErr;

    const totalLocked =
      activeBids?.reduce(
        (sum: number, row: any) => sum + Number(row.max_bid || 0),
        0
      ) || 0;

    // ----- BUYING POWER -----
    const buyingPower = totalDeposits * 4; // 4X Rule
    const remaining = Math.max(buyingPower - totalLocked, 0);

    const usagePercent =
      buyingPower > 0
        ? Math.round((totalLocked / buyingPower) * 100)
        : 0;

    return NextResponse.json({
      totalDeposits,
      buyingPower,
      remainingBuyingPower: remaining,
      usagePercent,
      activeBidTotal: totalLocked,
    });
  } catch (err) {
    console.error("BALANCE API ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load user balance" },
      { status: 500 }
    );
  }
}

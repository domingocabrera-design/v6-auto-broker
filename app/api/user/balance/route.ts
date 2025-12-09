import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID missing" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: deposits } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", userId);

    const availableDeposits =
      deposits?.filter((d: any) => d.status === "available")
        .reduce((sum: number, d: any) => sum + Number(d.amount), 0) || 0;

    const { data: bids } = await supabase
      .from("user_bids")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending");

    const usedDeposit =
      bids?.reduce((sum: number, b: any) => sum + Number(b.deposit_used), 0) || 0;

    const buyingPower = availableDeposits * 7;
    const remainingBuyingPower = buyingPower - usedDeposit * 7;

    return NextResponse.json({
      success: true,
      availableDeposits,
      usedDeposit,
      buyingPower,
      remainingBuyingPower,
      activeBids: bids || [],
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}

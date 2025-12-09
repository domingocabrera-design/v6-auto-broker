import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await req.json();

    const { bid_id } = body;

    if (!bid_id) {
      return NextResponse.json(
        { success: false, error: "Missing bid_id" },
        { status: 400 }
      );
    }

    // 🔐 Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user_id = user.id;

    // -----------------------------------------------------
    // 1️⃣ Get bid
    // -----------------------------------------------------
    const { data: bid } = await supabase
      .from("bids")
      .select("*")
      .eq("id", bid_id)
      .single();

    if (!bid) {
      return NextResponse.json(
        { success: false, error: "Bid not found" },
        { status: 404 }
      );
    }

    // Security check — only owner can cancel
    if (bid.user_id !== user_id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Already cancelled?
    if (bid.status === "Cancelled") {
      return NextResponse.json({
        success: true,
        message: "Bid already cancelled",
      });
    }

    const lockedAmount = Number(bid.locked_amount);

    // -----------------------------------------------------
    // 2️⃣ Get user's deposit wallet
    // -----------------------------------------------------
    const { data: deposit } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (!deposit) {
      return NextResponse.json(
        { success: false, error: "Deposit wallet not found" },
        { status: 500 }
      );
    }

    const newAvailable = Number(deposit.available_amount) + lockedAmount;
    const newLocked = Number(deposit.locked_amount) - lockedAmount;

    // -----------------------------------------------------
    // 3️⃣ Unlock deposit (update deposit table)
    // -----------------------------------------------------
    const { error: depErr } = await supabase
      .from("deposits")
      .update({
        available_amount: newAvailable,
        locked_amount: newLocked,
      })
      .eq("user_id", user_id);

    if (depErr) {
      console.error(depErr);
      return NextResponse.json(
        { success: false, error: "Failed updating deposit" },
        { status: 500 }
      );
    }

    // -----------------------------------------------------
    // 4️⃣ Update bid status → Cancelled
    // -----------------------------------------------------
    const { error: bidErr } = await supabase
      .from("bids")
      .update({ status: "Cancelled" })
      .eq("id", bid_id);

    if (bidErr) {
      console.error(bidErr);
      return NextResponse.json(
        { success: false, error: "Failed updating bid status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bid cancelled successfully",
      deposit: {
        available: newAvailable,
        locked: newLocked,
      },
    });
  } catch (err) {
    console.error("Cancel Bid API Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error while cancelling bid" },
      { status: 500 }
    );
  }
}

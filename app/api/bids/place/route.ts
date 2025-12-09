import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const body = await req.json();
    const { lot_id, bid_amount } = body;

    if (!lot_id || !bid_amount) {
      return NextResponse.json(
        { success: false, error: "Missing lot_id or bid_amount" },
        { status: 400 }
      );
    }

    // 🔐 Get user
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
    // 1️⃣ Get user's deposit wallet
    // -----------------------------------------------------
    const { data: deposit } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (!deposit) {
      return NextResponse.json(
        { success: false, error: "User has no deposit wallet created" },
        { status: 400 }
      );
    }

    const available = Number(deposit.available_amount);
    const locked = Number(deposit.locked_amount);

    // -----------------------------------------------------
    // 2️⃣ Required lock = 13% of bid OR $650 minimum
    // -----------------------------------------------------
    const requiredLock =
      bid_amount < 6000 ? 650 : Math.ceil(bid_amount * 0.13);

    // -----------------------------------------------------
    // 3️⃣ Check if user already has a bid for this lot
    // -----------------------------------------------------
    const { data: existingBid } = await supabase
      .from("bids")
      .select("*")
      .eq("lot_id", lot_id)
      .eq("user_id", user_id)
      .single();

    let additionalLockNeeded = requiredLock;

    if (existingBid) {
      const previousLock = Number(existingBid.locked_amount);

      if (requiredLock <= previousLock) {
        additionalLockNeeded = 0; // no extra money needed
      } else {
        additionalLockNeeded = requiredLock - previousLock;
      }
    }

    // -----------------------------------------------------
    // 4️⃣ Make sure user has enough available deposit
    // -----------------------------------------------------
    if (available < additionalLockNeeded) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient deposit",
          needed: additionalLockNeeded,
          available,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // 5️⃣ Lock deposit (subtract from available, add to locked)
    // -----------------------------------------------------
    const newAvailable = available - additionalLockNeeded;
    const newLocked = locked + additionalLockNeeded;

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
    // 6️⃣ Insert or update bid
    // -----------------------------------------------------
    if (!existingBid) {
      // CREATE NEW BID
      const { error: bidErr } = await supabase.from("bids").insert({
        user_id,
        lot_id,
        bid_amount,
        locked_amount: requiredLock,
        status: "Pending",
      });

      if (bidErr) {
        console.error(bidErr);
        return NextResponse.json(
          { success: false, error: "Failed placing bid" },
          { status: 500 }
        );
      }
    } else {
      // UPDATE EXISTING BID
      const { error: upErr } = await supabase
        .from("bids")
        .update({
          bid_amount,
          locked_amount: requiredLock,
          status: "Pending",
        })
        .eq("id", existingBid.id);

      if (upErr) {
        console.error(upErr);
        return NextResponse.json(
          { success: false, error: "Failed updating bid" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bid placed successfully",
      requiredLock,
      deposit: {
        available: newAvailable,
        locked: newLocked,
      },
    });
  } catch (err) {
    console.error("Bid API Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error while placing bid" },
      { status: 500 }
    );
  }
}

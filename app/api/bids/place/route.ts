import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ───────────────── PLAN LIMITS ───────────────── */
const PLAN_LIMITS: Record<string, number> = {
  single: 1,
  three: 3,
  five: 5,
  ten: 10,
};

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    /* ───────────────── INPUT ───────────────── */
    const body = await req.json();
    const { lot_id, bid_amount } = body;

    if (!lot_id || !bid_amount || bid_amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid bid data" },
        { status: 400 }
      );
    }

    /* ───────────────── AUTH ───────────────── */
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

    /* ───────────────── PROFILE (ADMIN OVERRIDE) ───────────────── */
    const { data: profile } = await supabase
      .from("profiles")
      .select("admin_bid_limit_override")
      .eq("id", user_id)
      .maybeSingle();

    /* ───────────────── SUBSCRIPTION ───────────────── */
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status, plan")
      .eq("user_id", user_id)
      .maybeSingle();

    if (
      !subscription ||
      !["active", "trialing"].includes(subscription.status)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Subscription required",
          upgrade_required: true,
        },
        { status: 403 }
      );
    }

    const plan = subscription.plan;
    const planLimit = PLAN_LIMITS[plan] ?? 0;

    /* ───────────────── EFFECTIVE BID LIMIT ───────────────── */
    const effectiveBidLimit =
      profile?.admin_bid_limit_override ?? planLimit;

    /* ───────────────── ACTIVE BID COUNT ───────────────── */
    const { count: activeBidCount } = await supabase
      .from("bids")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user_id)
      .in("status", ["Pending", "Active"]);

    if ((activeBidCount ?? 0) >= effectiveBidLimit) {
      return NextResponse.json(
        {
          success: false,
          code: "LIMIT_REACHED",
          message: "Bid limit reached for your plan",
          upgrade_required: true,
          current_plan: plan,
          max_bids: effectiveBidLimit,
          suggested_plan:
            plan === "single" ? "three" :
            plan === "three" ? "five" :
            "ten",
        },
        { status: 403 }
      );
    }

    /* ───────────────── DEPOSIT WALLET ───────────────── */
    const { data: deposit } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (!deposit) {
      return NextResponse.json(
        { success: false, error: "Deposit wallet not found" },
        { status: 400 }
      );
    }

    const available = Number(deposit.available_amount);
    const locked = Number(deposit.locked_amount);

    /* ───────────────── REQUIRED LOCK ───────────────── */
    const requiredLock =
      bid_amount < 6000 ? 650 : Math.ceil(bid_amount * 0.13);

    /* ───────────────── EXISTING BID ───────────────── */
    const { data: existingBid } = await supabase
      .from("bids")
      .select("*")
      .eq("lot_id", lot_id)
      .eq("user_id", user_id)
      .maybeSingle();

    let additionalLockNeeded = requiredLock;

    if (existingBid) {
      const previousLock = Number(existingBid.locked_amount);
      additionalLockNeeded =
        requiredLock > previousLock
          ? requiredLock - previousLock
          : 0;
    }

    /* ───────────────── FUNDS CHECK ───────────────── */
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

    /* ───────────────── UPDATE DEPOSIT ───────────────── */
    await supabase
      .from("deposits")
      .update({
        available_amount: available - additionalLockNeeded,
        locked_amount: locked + additionalLockNeeded,
      })
      .eq("user_id", user_id);

    /* ───────────────── BID EXPIRATION (24H V1) ───────────────── */
    const expires_at = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();

    /* ───────────────── INSERT / UPDATE BID ───────────────── */
    if (!existingBid) {
      await supabase.from("bids").insert({
        user_id,
        lot_id,
        bid_amount,
        locked_amount: requiredLock,
        status: "Pending",
        expires_at,
      });
    } else {
      await supabase
        .from("bids")
        .update({
          bid_amount,
          locked_amount: requiredLock,
          status: "Pending",
          expires_at,
        })
        .eq("id", existingBid.id);
    }

    /* ───────────────── SUCCESS ───────────────── */
    return NextResponse.json({
      success: true,
      message: "Bid placed successfully",
      plan,
      maxBids: effectiveBidLimit,
      requiredLock,
      expires_at,
      deposit: {
        available: available - additionalLockNeeded,
        locked: locked + additionalLockNeeded,
      },
    });
  } catch (err) {
    console.error("❌ Bid API Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error while placing bid" },
      { status: 500 }
    );
  }
}

// app/api/bid/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Extract lot number from Copart URL
function extractLotId(url: string): string | null {
  const match = url.match(/\/lot\/(\d+)/i);
  if (match && match[1]) return match[1];

  const last = url.split("/").pop();
  if (/^\d+$/.test(last || "")) return last || null;

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { full_name, phone, email, lot_url, notes, bid_amount } = body;

    if (!full_name || !phone || !email || !lot_url || !bid_amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Get Copart lot_id from URL
    const lot_id = extractLotId(lot_url);
    if (!lot_id) {
      return NextResponse.json(
        { success: false, error: "Invalid Copart URL, lot_id not found." },
        { status: 400 }
      );
    }

    // Authenticated user (customer logged in)
    const supabaseUser = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }

    const user_id = user.id;

    // Create Admin Supabase client (service role)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ----------------------------
    // 1️⃣ GET USER DEPOSIT
    // ----------------------------
    const { data: deposit, error: depError } = await supabaseAdmin
      .from("deposits")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (depError || !deposit) {
      return NextResponse.json({
        success: false,
        error: "User has no deposit on file.",
      });
    }

    const available = deposit.available_amount ?? 0;
    const locked = deposit.locked_amount ?? 0;

    // ----------------------------
    // 2️⃣ APPLY DEPOSIT RULES
    // ----------------------------
    let requiredDeposit = 0;

    if (bid_amount < 6000) {
      requiredDeposit = 650;
    } else {
      requiredDeposit = Math.ceil(bid_amount * 0.13);
    }

    if (available < requiredDeposit) {
      return NextResponse.json({
        success: false,
        error: `Insufficient deposit. Required: $${requiredDeposit}, Available: $${available}`,
      });
    }

    // ----------------------------
    // 3️⃣ LOCK REQUIRED DEPOSIT
    // ----------------------------
    const newLocked = locked + requiredDeposit;
    const newAvailable = available - requiredDeposit;

    const { error: lockError } = await supabaseAdmin
      .from("deposits")
      .update({
        locked_amount: newLocked,
        available_amount: newAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id);

    if (lockError) {
      return NextResponse.json({
        success: false,
        error: "Failed to lock deposit.",
      });
    }

    // ----------------------------
    // 4️⃣ SAVE BID REQUEST
    // ----------------------------
    const { error: insertError } = await supabaseAdmin
      .from("request_buy")
      .insert({
        full_name,
        phone,
        email,
        lot_url,
        lot_id,
        notes,
        bid_amount,
        user_id,
        deposit_locked: requiredDeposit,
      });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { success: false, error: "Failed to save bid request." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bid request saved + deposit locked.",
      lot_id,
      requiredDeposit,
      available_after: newAvailable,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}

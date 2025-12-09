// app/api/deposit/release/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST() {
  try {
    const supabaseUser = createRouteHandlerClient({ cookies });

    // 1. Get authenticated user
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

    // 2. Create admin client to override RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Load deposit row
    const { data: deposit, error: depError } = await supabaseAdmin
      .from("deposits")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (depError || !deposit) {
      return NextResponse.json({
        success: false,
        error: "Deposit record not found.",
      });
    }

    const locked = deposit.locked_amount || 0;

    if (locked <= 0) {
      return NextResponse.json({
        success: false,
        error: "No locked deposit to release.",
      });
    }

    // 4. Release all locked funds → move back to available
    const newAvailable = deposit.available_amount + locked;

    const { error: updateError } = await supabaseAdmin
      .from("deposits")
      .update({
        locked_amount: 0,
        available_amount: newAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id);

    if (updateError) {
      return NextResponse.json({
        success: false,
        error: "Failed to release deposit.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Deposit released successfully.",
      released: locked,
      newAvailable,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}

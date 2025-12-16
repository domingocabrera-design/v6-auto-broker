import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();

    // ✅ ALWAYS get user from session (never from body)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, type = "card" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    /* ───────────────────────────────────── */
    /* 🔒 BLOCK DEPOSIT DURING TRIAL */
    /* ───────────────────────────────────── */
    const { data: sub, error: subError } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .single();

    if (subError || !sub || sub.status !== "active") {
      return NextResponse.json(
        {
          error:
            "Deposits are disabled during your free trial. Please upgrade to activate bidding.",
        },
        { status: 403 }
      );
    }

    /* ───────────────────────────────────── */
    /* ✅ INSERT DEPOSIT */
    /* ───────────────────────────────────── */
    const { data, error } = await supabase
      .from("deposits")
      .insert({
        user_id: user.id, // 🔐 server-trusted
        amount,
        type,
        status: "pending", // 🔒 never auto-complete
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, deposit: data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

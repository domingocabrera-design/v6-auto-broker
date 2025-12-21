import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    /* ───── FIX: AWAIT COOKIES ───── */
    const cookieStore = await cookies();

    /* ───── AUTH CLIENT (USER SESSION) ───── */
    const supabaseAuth = createRouteHandlerClient({
      cookies: () => cookieStore, // ✅ NOW SYNC
    });

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    /* ───── ADMIN CHECK ───── */
    const ADMIN_EMAILS = ["v6autobroker@yahoo.com"];

    if (!ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 }
      );
    }

    /* ───── ENV CHECK ───── */
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ SERVICE ROLE KEY MISSING");
      return NextResponse.json(
        { success: false, error: "Service role key missing" },
        { status: 500 }
      );
    }

    /* ───── SERVICE ROLE CLIENT (RLS BYPASS) ───── */
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    /* ───── INPUT ───── */
    const { user_id, override } = await req.json();

    const overrideValue =
      override === null || override === undefined
        ? null
        : Number(override);

    /* ───── UPDATE PROFILE ───── */
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ admin_bid_limit_override: overrideValue })
      .eq("id", user_id);

    if (error) {
      console.error("❌ UPDATE FAILED:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Override saved",
    });
  } catch (err) {
    console.error("❌ ADMIN OVERRIDE CRASH:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🔐 Service role client (server only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log("🕒 Running expire-trials cron");

    const now = new Date().toISOString();

    // 1️⃣ Find trial subscriptions that expired
    const { data: expiredTrials, error } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("status", "trialing")
      .lte("trial_ends_at", now);

    if (error) {
      console.error("❌ Select error:", error.message);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    if (!expiredTrials || expiredTrials.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired trials",
      });
    }

    const ids = expiredTrials.map((t) => t.id);

    // 2️⃣ Mark them as expired (NO updated_at column)
    const { error: updateErr } = await supabase
      .from("subscriptions")
      .update({
        status: "expired",
      })
      .in("id", ids);

    if (updateErr) {
      console.error("❌ Update error:", updateErr.message);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    console.log(`✅ Expired ${ids.length} trial(s)`);

    return NextResponse.json({
      success: true,
      expired: ids.length,
    });
  } catch (err) {
    console.error("❌ Cron crash:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

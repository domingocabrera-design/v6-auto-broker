import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // REQUIRED
  );

  try {
    await supabase.rpc("unlock_expired_bids_and_deposits");

    return NextResponse.json({
      success: true,
      message: "Expired bids processed",
    });
  } catch (err) {
    console.error("CRON ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Cron failed" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 🚫 Live Copart bid feed DISABLED
 *
 * - No polling Copart
 * - No live bid scraping
 * - All bid tracking is internal only
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Live bid feed disabled. Bid updates are managed internally.",
    },
    { status: 410 }
  );
}

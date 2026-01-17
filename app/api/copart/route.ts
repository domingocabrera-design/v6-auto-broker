import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 🚫 Live Copart access is permanently disabled.
 *
 * Reason:
 * - Copart flagged automation previously
 * - All inventory is now sourced via CSV imports
 * - All bidding is performed manually by licensed dealers
 *
 * This endpoint is intentionally blocked to ensure compliance.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Live Copart lookups are disabled. Inventory is provided via CSV imports only.",
    },
    { status: 410 }
  );
}

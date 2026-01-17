import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 🚫 AUTO-BIDDING & LIVE COPART ACCESS DISABLED
 *
 * Reason:
 * - Copart previously flagged automation behavior
 * - Live bid polling violates Copart terms
 * - All bids are placed MANUALLY by licensed dealers
 * - V6 Auto Broker operates as a broker/CRM only
 *
 * This endpoint is intentionally disabled to ensure compliance.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Auto bidding is disabled. All bids are placed manually through licensed dealer accounts.",
    },
    { status: 410 }
  );
}

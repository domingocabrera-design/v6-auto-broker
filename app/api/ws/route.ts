import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 🚫 LIVE COPART WEBSOCKET DISABLED
 *
 * Reason:
 * - Live polling Copart violates their monitoring rules
 * - WebSocket fan-out amplifies automation signals
 * - V6 Auto Broker operates as a broker CRM only
 *
 * All auction updates are entered MANUALLY by admins
 * after bids are placed through licensed dealer accounts.
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Live auction updates are disabled. Inventory updates are provided via CSV imports and manual admin updates only.",
    },
    { status: 410 }
  );
}

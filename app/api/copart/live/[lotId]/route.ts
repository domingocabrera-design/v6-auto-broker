import { NextRequest, NextResponse } from "next/server";
import fetchCopartLot from "@/lib/fetchCopartLot";
import normalizeLot from "@/lib/normalizeLot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ lotId: string }> }
) {
  try {
    const { lotId } = await context.params;

    if (!lotId) {
      return NextResponse.json(
        { success: false, error: "Missing lotId" },
        { status: 400 }
      );
    }

    // Fetch from Copart (raw JSON or HTML fallback)
    const raw = await fetchCopartLot(lotId);

    if (!raw) {
      return NextResponse.json(
        { success: false, error: "Lot not found" },
        { status: 404 }
      );
    }

    // ⭐ FIX: normalizeLot requires 2 arguments
    const lot = normalizeLot(raw, lotId);

    return NextResponse.json({ success: true, lot });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown server error";
    console.error("🔥 Live lot API error:", msg);

    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

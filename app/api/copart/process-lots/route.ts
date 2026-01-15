import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import normalizeLot from "@/lib/normalizeLot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = body;

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: "Invalid rows payload" },
        { status: 400 }
      );
    }

    const processed: string[] = [];

    for (const r of rows) {
      // ✅ FIX: pass ONE argument only
      const normalized = normalizeLot({
        ...r.raw,
        lot_id: r.lot_id,
      });

      const { error } = await supabaseAdmin
        .from("lots")
        .upsert(normalized, { onConflict: "lot_id" });

      if (!error) {
        processed.push(r.lot_id);
      } else {
        console.error("❌ Upsert error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      rows_processed: processed.length,
      rows: processed,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

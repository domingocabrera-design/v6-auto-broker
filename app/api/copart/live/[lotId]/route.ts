import { NextRequest, NextResponse } from "next/server";
import getCopartLot from "@/lib/getCopartLot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ lotId: string }> }
) {
  console.log("🔵 DEBUG → Route HIT");

  // ✅ NEW NEXT.JS REQUIREMENT: await params
  const { lotId } = await context.params;
  console.log("🟣 DEBUG → Extracted lotId:", lotId);

  if (!lotId) {
    console.log("🔴 DEBUG → lotId missing!");
    return NextResponse.json(
      { success: false, error: "Missing lotId" },
      { status: 400 }
    );
  }

  try {
    const lot = await getCopartLot(lotId);

    if (!lot) {
      console.log("🟠 DEBUG → Copart blocked request or no data");
      return NextResponse.json(
        { success: false, error: "Copart blocked the request" },
        { status: 404 }
      );
    }

    console.log("🟢 DEBUG → Lot successfully fetched!");
    return NextResponse.json(
      { success: true, lot },
      { status: 200 }
    );
  } catch (err) {
    console.log("🔴 DEBUG → Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

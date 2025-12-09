import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lotId, images } = body;

    if (!lotId || !images) {
      return NextResponse.json(
        { error: "Missing lotId or images" },
        { status: 400 }
      );
    }

    // -------------------------------
    // Your logic to process images here
    // Example:
    // await supabase.from("lot_images").insert({...});
    // -------------------------------

    return NextResponse.json(
      { success: true, message: "Images imported" },
      { status: 200 }
    );

  } catch (err: unknown) {
    // SAFELY HANDLE UNKNOWN ERROR
    const message =
      err instanceof Error ? err.message : "Unknown server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

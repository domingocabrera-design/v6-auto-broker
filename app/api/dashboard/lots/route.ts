import { NextResponse } from "next/server";

// We reuse your featured lots API for now.
export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/copart/get-featured`);
    const data = await res.json();

    return NextResponse.json({ success: true, data: data.cars || [] });
  } catch (err) {
    console.log("LIVE LOTS ERROR:", err);

    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ lots: [] });
    }

    // 🔵 Example external bridge endpoint:
    const url = `https://v6-copart-bridge.vercel.app/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json({
      success: true,
      lots: data?.results || [],
    });

  } catch (err) {
    console.error("Copart search error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to search Copart" },
      { status: 500 }
    );
  }
}

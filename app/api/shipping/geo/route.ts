import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { zip } = await req.json();

    if (!zip) {
      return NextResponse.json(
        { success: false, error: "ZIP code required" },
        { status: 400 }
      );
    }

    const url = `https://api.zippopotam.us/us/${zip}`;
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Invalid ZIP code" },
        { status: 400 }
      );
    }

    const data = await res.json();

    const lat = parseFloat(data.places[0].latitude);
    const lon = parseFloat(data.places[0].longitude);

    return NextResponse.json({
      success: true,
      lat,
      lon,
    });
  } catch (err) {
    console.error("ZIP GEO ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to geocode ZIP" },
      { status: 500 }
    );
  }
}

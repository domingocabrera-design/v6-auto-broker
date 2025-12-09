import { NextResponse } from "next/server";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Earth radius in miles
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(req: Request) {
  try {
    const { yardLat, yardLon, customerLat, customerLon, rate } = await req.json();

    if (!yardLat || !yardLon || !customerLat || !customerLon) {
      return NextResponse.json(
        { success: false, error: "Missing coordinates" },
        { status: 400 }
      );
    }

    const miles = haversineDistance(yardLat, yardLon, customerLat, customerLon);

    const price = miles * (rate || 2.25); // default rate per mile

    return NextResponse.json({
      success: true,
      miles: Math.round(miles),
      price: Math.round(price),
    });
  } catch (err) {
    console.error("SHIPPING ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Shipping calculation failed" },
      { status: 500 }
    );
  }
}

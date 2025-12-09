import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Calculate distance in miles (fallback)
function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(req: NextRequest) {
  try {
    const { pickup, delivery } = await req.json();

    if (!pickup || !delivery) {
      return NextResponse.json(
        { error: "Missing pickup or delivery coordinates" },
        { status: 400 }
      );
    }

    const distance = calculateDistanceMiles(
      pickup.lat,
      pickup.lng,
      delivery.lat,
      delivery.lng
    );

    // Simple pricing model — adjust as needed
    const pricePerMile = 2.50;
    const estimatedPrice = distance * pricePerMile;

    return NextResponse.json({
      success: true,
      distance_miles: distance.toFixed(2),
      estimated_price: estimatedPrice.toFixed(2),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// app/api/copart/route.ts
import { NextResponse } from "next/server";

// Extract lot id from URL
function extractLotId(url: string): string | null {
  const match = url.match(/\/lot\/(\d+)/i);
  if (match && match[1]) return match[1];
  const last = url.split("/").pop();
  if (/^\d+$/.test(last || "")) return last || null;
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url) {
      return NextResponse.json(
        { success: false, error: "Missing URL" },
        { status: 400 }
      );
    }

    const lot_id = extractLotId(url);
    if (!lot_id) {
      return NextResponse.json(
        { success: false, error: "Lot ID not found" },
        { status: 400 }
      );
    }

    // 🔥 Copart PUBLIC API endpoint (this one works without login)
    const apiUrl = `https://www.copart.com/public/data/lotdetails/solr/${lot_id}`;

    // 🔥 REQUIRED HEADERS so Copart doesn't block us
    const res = await fetch(apiUrl, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.copart.com",
      },
      cache: "no-store"
    });

    // If Copart returns HTML => block
    const text = await res.text();
    if (text.startsWith("<")) {
      return NextResponse.json(
        {
          success: false,
          error: "Copart blocked the request (HTML returned instead of JSON)."
        },
        { status: 500 }
      );
    }

    const json = JSON.parse(text);

    if (!json || !json.data || !json.data.lotDetails) {
      return NextResponse.json(
        { success: false, error: "Failed to read Copart data." },
        { status: 500 }
      );
    }

    const lot = json.data.lotDetails;

    const parsed = {
      lot_id,
      vin: lot.vin || "",
      year: lot.lotYear || "",
      make: lot.make || "",
      model: lot.modelGroup || lot.model || "",
      odometer: lot.odometer || "",
      damage: lot.damageDescription || "",
      docType: lot.docType || "",
      location: lot.yardName || "",
      auctionDate: lot.auctionDate || "",
      images: lot.imagesList || [],
      url,
    };

    return NextResponse.json({ success: true, data: parsed });

  } catch (err) {
    console.error("COPART LOOKUP ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Server error during lookup" },
      { status: 500 }
    );
  }
}

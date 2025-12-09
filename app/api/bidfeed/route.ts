import { NextResponse } from "next/server";

async function fetchBid(lotId: string) {
  try {
    const res = await fetch(`https://www.copart.com/public/data/lotdetails/solr/${lotId}`);
    const json = await res.json();
    return json?.data?.lotDetails?.lotCurrentBidAmount || null;
  } catch (e) {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lotId = searchParams.get("lotId");

  if (!lotId)
    return NextResponse.json({ success: false, error: "Missing lotId" });

  const bid = await fetchBid(lotId);
  return NextResponse.json({ success: true, bid });
}

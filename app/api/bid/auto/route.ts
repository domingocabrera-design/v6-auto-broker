import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Fetch latest Copart bid
async function getLiveBid(lotId: string) {
  const res = await fetch(
    `https://www.copart.com/public/data/lotdetails/solr/${lotId}`
  );
  const json = await res.json();
  return json?.data?.lotDetails?.lotCurrentBidAmount || 0;
}

export async function POST(req: Request) {
  try {
    const { lotId } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all active bids for this lot
    const { data: bids, error } = await supabase
      .from("user_bids")
      .select("*")
      .eq("lot_id", lotId)
      .eq("active", true);

    if (error) throw error;

    if (!bids.length)
      return NextResponse.json({ success: true, message: "No active bidders" });

    // LIVE BID
    const liveBid = await getLiveBid(lotId);

    // PROCESS EACH BIDDER
    for (const b of bids) {
      if (liveBid + 100 > b.max_bid) {
        // Close bidder (max reached)
        await supabase
          .from("user_bids")
          .update({ active: false })
          .eq("id", b.id);

        continue;
      }

      // Otherwise place next bid
      await fetch(`${process.env.INTERNAL_BID_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lotId,
          amount: liveBid + 100, // increment
          bidder: b.user_email,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Auto bidding processed",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Auto-bid engine failed" },
      { status: 500 }
    );
  }
}

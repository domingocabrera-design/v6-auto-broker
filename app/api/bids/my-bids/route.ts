import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();

    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user_id" },
        { status: 400 }
      );
    }

    // ================================
    // 1. Get all bids for this user
    // ================================
    const { data: bids, error: bidsError } = await supabase
      .from("bids")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (bidsError) {
      console.error("❌ Failed fetching bids:", bidsError);
      return NextResponse.json({ error: bidsError.message }, { status: 500 });
    }

    if (!bids || bids.length === 0) {
      return NextResponse.json({ bids: [], lots: [] }, { status: 200 });
    }

    // ================================
    // 2. Extract unique lot IDs from bids
    // ================================
    const lotIds = Array.from(new Set(bids.map((bid: any) => bid.lot_id)));

    // ================================
    // 3. Fetch all related lots in one query
    // ================================
    const { data: lots, error: lotsError } = await supabase
      .from("lots")
      .select(`
        lot_id,
        year,
        make,
        model,
        status,
        primary_damage,
        buy_it_now,
        auction_date,
        lot_images (image_url)
      `)
      .in("lot_id", lotIds);

    if (lotsError) {
      console.error("❌ Failed fetching lots:", lotsError);
      return NextResponse.json({ error: lotsError.message }, { status: 500 });
    }

    // ================================
    // 4. Map lots by lot_id (FIXED TYPING)
    // ================================
    const lotMap: Record<string, any> = {};

    lots?.forEach((lot: any) => {
      lotMap[lot.lot_id] = {
        ...lot,
        image_url: lot.lot_images?.[0]?.image_url || null,
      };
    });

    // ================================
    // 5. Attach lots to each bid
    // ================================
    const combined = bids.map((bid: any) => ({
      ...bid,
      lot: lotMap[bid.lot_id] ?? null,
    }));

    return NextResponse.json({ bids: combined }, { status: 200 });

  } catch (err: any) {
    console.error("❌ my-bids API error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

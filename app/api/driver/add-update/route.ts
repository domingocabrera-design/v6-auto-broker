import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { data: user } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lat, lng, note, order_id } = await req.json();
    if (!lat || !lng) {
      return NextResponse.json({ error: "Lat/Lng required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("shipping_tracking_updates")
      .insert({
        order_id,
        lat,
        lng,
        note: note || null
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true, update: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

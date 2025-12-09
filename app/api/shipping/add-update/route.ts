import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const body = await req.json();
    const { order_id, lat, lng, note } = body;

    const { data, error } = await supabase
      .from("shipping_tracking_updates")
      .insert([
        {
          order_id,
          lat,
          lng,
          note,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, update: data[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

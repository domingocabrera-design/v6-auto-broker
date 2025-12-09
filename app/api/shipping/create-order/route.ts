import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const body = await req.json();
    const { user_id, lot_id, pickup_location, destination_address, eta } = body;

    const { data, error } = await supabase
      .from("shipping_orders")
      .insert([
        {
          user_id,
          lot_id,
          pickup_location,
          destination_address,
          eta,
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

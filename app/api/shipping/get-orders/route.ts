import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { user_id } = await req.json();

    // Fetch all orders for this user
    const { data: orders, error } = await supabase
      .from("shipping_orders")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    // Fetch tracking for each order
    const orderIds = orders.map((o) => o.id);

    const { data: tracking } = await supabase
      .from("shipping_tracking_updates")
      .select("*")
      .in("order_id", orderIds);

    return NextResponse.json({ success: true, orders, tracking });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

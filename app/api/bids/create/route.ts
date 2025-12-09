import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  try {
    const body = await req.json();

    const { user_name, user_phone, user_email, lot_id, max_bid } = body;

    if (!user_name || !user_phone || !user_email || !lot_id || !max_bid) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("user_bids")
      .insert([
        {
          user_name,
          user_phone,
          user_email,
          lot_id,
          max_bid: Number(max_bid),
          active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Bid request submitted!",
      bid: data,
    });
  } catch (err) {
    console.error("CREATE BID ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Could not submit bid request" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();

    const body = await req.json();
    const { user_id, amount, type = "card" } = body;

    if (!user_id || !amount) {
      return NextResponse.json(
        { error: "Missing user_id or amount" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("deposits")
      .insert({
        user_id,
        amount,
        type,
        status: "completed",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, deposit: data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

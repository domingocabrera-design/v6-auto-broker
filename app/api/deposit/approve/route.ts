import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deposit_id } = body;

    if (!deposit_id) {
      return NextResponse.json(
        { error: "Missing deposit_id" },
        { status: 400 }
      );
    }

    // Approve the deposit
    const { data, error } = await supabaseAdmin
      .from("deposits")
      .update({ status: "approved" })
      .eq("id", deposit_id)
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

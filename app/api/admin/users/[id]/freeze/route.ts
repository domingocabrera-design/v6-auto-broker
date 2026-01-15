import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "User ID missing" },
      { status: 400 }
    );
  }

  // 🔒 Freeze logic goes here
  // example:
  // await supabase.from("users").update({ frozen: true }).eq("id", id);

  return NextResponse.json({ success: true });
}

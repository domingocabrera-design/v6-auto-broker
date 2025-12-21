import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("deposits")
    .select("*")
    .eq("status", "locked")
    .lte("locked_until", now);

  // Do nothing automatically — admin decides
  return NextResponse.json({ ready_for_review: data?.length || 0 });
}

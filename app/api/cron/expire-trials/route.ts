import { NextRequest, NextResponse } from "next/server";
import { verifyCron } from "@/lib/cronAuth";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();

  const { data } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("is_trial_active", true)
    .lte("trial_ends_at", now);

  if (!data?.length) {
    return NextResponse.json({ message: "No trials expired" });
  }

  const ids = data.map(u => u.id);

  await supabaseAdmin
    .from("users")
    .update({
      is_trial_active: false,
      plan: "expired"
    })
    .in("id", ids);

  return NextResponse.json({
    success: true,
    expired: ids.length
  });
}

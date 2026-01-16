import { NextRequest, NextResponse } from "next/server";
import { verifyCron } from "@/lib/cronAuth";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const inTwoDays = new Date();
  inTwoDays.setDate(now.getDate() + 2);

  const { data } = await supabaseAdmin
    .from("users")
    .select("id, email")
    .eq("is_trial_active", true)
    .eq("trial_reminder_sent", false)
    .lte("trial_ends_at", inTwoDays.toISOString());

  if (!data?.length) {
    return NextResponse.json({ message: "No reminders needed" });
  }

  for (const user of data) {
    // TODO: send email here
    await supabaseAdmin
      .from("users")
      .update({ trial_reminder_sent: true })
      .eq("id", user.id);
  }

  return NextResponse.json({
    success: true,
    remindersSent: data.length
  });
}

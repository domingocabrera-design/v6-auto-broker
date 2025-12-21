import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdminRoute } from "@/lib/isAdminRoute";
import { sendEmail } from "@/lib/email";
import {
  frozenUserTemplate,
  unfrozenUserTemplate,
  adminAlertTemplate,
} from "@/lib/emailTemplates";

export async function POST(req: Request) {
  // 🔐 Admin-only enforcement (API-safe)
  const admin = await isAdminRoute();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, freeze } = await req.json();

  if (!userId || typeof freeze !== "boolean") {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  // 1️⃣ Get user email
  const { data: user } = await supabaseAdmin
    .from("admin_users_view")
    .select("email")
    .eq("id", userId)
    .single();

  if (!user?.email) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // 2️⃣ Update freeze state
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      is_frozen: freeze,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // 3️⃣ Emails (non-blocking)
  const userEmail = user.email;

  if (freeze) {
    await sendEmail({
      to: userEmail,
      subject: "Your V6 Auto Broker account has been frozen",
      html: frozenUserTemplate(userEmail),
    });

    await sendEmail({
      to: process.env.ADMIN_ALERT_EMAIL!,
      subject: "User Frozen",
      html: adminAlertTemplate(userEmail, "frozen"),
    });
  } else {
    await sendEmail({
      to: userEmail,
      subject: "Your V6 Auto Broker account has been restored",
      html: unfrozenUserTemplate(userEmail),
    });

    await sendEmail({
      to: process.env.ADMIN_ALERT_EMAIL!,
      subject: "User Unfrozen",
      html: adminAlertTemplate(userEmail, "unfrozen"),
    });
  }

  return NextResponse.json({ success: true });
}

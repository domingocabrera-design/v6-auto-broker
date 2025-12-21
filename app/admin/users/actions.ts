"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/auditLog";
import { sendEmail } from "@/lib/email";
import {
  userFrozenEmail,
  userUnfrozenEmail,
  adminFreezeAlert,
} from "@/lib/emailTemplates";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function setUserFrozen(
  targetUserId: string,
  frozen: boolean
) {
  const supabaseAuth = createServerComponentClient({ cookies });

  const {
    data: { user: admin },
  } = await supabaseAuth.auth.getUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  /* ───── LOAD USER PROFILE ───── */
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, is_frozen")
    .eq("id", targetUserId)
    .single();

  if (!profile?.email) {
    throw new Error("User not found");
  }

  /* ───── UPDATE FREEZE STATUS ───── */
  await supabaseAdmin
    .from("profiles")
    .update({ is_frozen: frozen })
    .eq("id", targetUserId);

  /* ───── AUDIT LOG ───── */
  await logAdminAction({
    adminUserId: admin.id,
    targetUserId,
    action: frozen ? "FREEZE_USER" : "UNFREEZE_USER",
    entity: "profiles",
    entityId: targetUserId,
    before: { is_frozen: profile.is_frozen },
    after: { is_frozen: frozen },
  });

  /* ───── EMAIL USER ───── */
  if (frozen) {
    const email = userFrozenEmail(profile.email);
    await sendEmail({
      to: profile.email,
      subject: email.subject,
      html: email.html,
    });
  } else {
    const email = userUnfrozenEmail(profile.email);
    await sendEmail({
      to: profile.email,
      subject: email.subject,
      html: email.html,
    });
  }

  /* ───── EMAIL ADMIN ───── */
  const adminEmail =
    admin.email || process.env.ADMIN_ALERT_EMAIL!;

  const alert = adminFreezeAlert(
    adminEmail,
    profile.email,
    frozen
  );

  await sendEmail({
    to: process.env.ADMIN_ALERT_EMAIL!,
    subject: alert.subject,
    html: alert.html,
  });
}

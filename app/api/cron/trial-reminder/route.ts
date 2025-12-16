import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // 48 hours from now
  const reminderDate = new Date();
  reminderDate.setHours(reminderDate.getHours() + 48);

  const { data: trials } = await supabase
    .from("subscriptions")
    .select("id, user_id, trial_ends_at, trial_reminder_sent, users:auth.users(email)")
    .eq("status", "trialing")
    .eq("trial_reminder_sent", false)
    .lte("trial_ends_at", reminderDate.toISOString());

  if (!trials || trials.length === 0) {
    return NextResponse.json({ message: "No reminders to send" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  for (const sub of trials) {
    const email = sub.users?.email;
    if (!email) continue;

    await transporter.sendMail({
      from: `"V6 Auto Broker" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your V6 Auto Broker trial is ending soon",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Your free trial ends soon</h2>
          <p>
            Your V6 Auto Broker free trial will end in <strong>48 hours</strong>.
          </p>
          <p>
            Upgrade now to unlock bidding and avoid interruption.
          </p>
          <a href="${process.env.NEXT_PUBLIC_URL}/pricing"
             style="display:inline-block;padding:12px 20px;background:#facc15;color:#000;border-radius:8px;text-decoration:none;font-weight:bold">
             Upgrade Now
          </a>
          <p style="margin-top:20px;color:#888">
            No action is required if you don’t wish to continue.
          </p>
        </div>
      `,
    });

    await supabase
      .from("subscriptions")
      .update({ trial_reminder_sent: true })
      .eq("id", sub.id);
  }

  return NextResponse.json({ sent: trials.length });
}

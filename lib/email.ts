import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key missing");
    return;
  }

  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject,
    html,
  });
}

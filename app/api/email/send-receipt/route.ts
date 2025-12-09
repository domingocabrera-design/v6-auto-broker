import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      email,
      lotNumber,
      brokerFee,
      breakdown,
      paidVia,
      createdAt,
    } = await req.json();

    const htmlContent = `
      <div style="font-family: Arial; padding:20px;">
        <h2>V6 Auto Broker – Broker Fee Receipt</h2>

        <p>Thank you for using V6 Auto Broker. Below is your receipt.</p>

        <h3>Receipt Details</h3>
        <p><strong>Lot Number:</strong> ${lotNumber}</p>
        <p><strong>Broker Fee:</strong> $${brokerFee}</p>
        <p><strong>Paid Via:</strong> ${paidVia.toUpperCase()}</p>
        <p><strong>Date:</strong> ${new Date(createdAt).toLocaleString()}</p>

        <h3>Fee Breakdown</h3>
        <ul>
          ${
            breakdown.title_handling_processing
              ? `<li>Title Handling & Processing: $${breakdown.title_handling_processing}</li>`
              : ""
          }
          <li>Broker Service Fee: $${breakdown.broker_service_fee}</li>
        </ul>

        <br />
        <p><strong>Total: $${brokerFee}</strong></p>
        <br />
        <p>V6 Auto Broker — Buy Cars Like a Dealer.</p>
      </div>
    `;

    const emailResult = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `Your Broker Fee Receipt – Lot ${lotNumber}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, emailResult });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

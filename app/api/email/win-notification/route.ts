import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const bid = await req.json();

    const {
      lot_number,
      final_price,
      user_email,
      broker_fee,
      locked_amount,
    } = bid;

    const html = `
      <div style="font-family: Arial; padding:20px; max-width:600px;">
        
        <h2 style="color:#1A73E8;">🎉 Congratulations! You Won Your Vehicle 🎉</h2>

        <p>You just won <strong>Lot #${lot_number}</strong> through <strong>V6 Auto Broker</strong>.</p>

        <h3>💵 Amount Due to Copart</h3>
        <p><strong>Total Winning Price:</strong> $${final_price}</p>
        <p><strong>Due Date:</strong> <span style="color:red;">Within 3 business days</span></p>
        <p>If payment is late, Copart applies an automatic <strong>$50 late fee</strong>.</p>

        <hr />

        <h3>🏦 Copart Wire Payment Instructions</h3>
        <p>Please send a wire transfer using the information below:</p>

        <ul>
          <li><strong>Bank Name:</strong> JPMorgan Chase (Example)</li>
          <li><strong>Account Name:</strong> Copart Inc.</li>
          <li><strong>Account Number:</strong> 00000000 (replace)</li>
          <li><strong>Routing Number:</strong> 00000000 (replace)</li>
          <li><strong>Reference:</strong> Lot #${lot_number} - ${user_email}</li>
        </ul>

        <p>
          <strong>If the reference is missing, payment may be delayed or not matched.</strong>
        </p>

        <hr />

        <h3>🔐 Broker Fee Receipt</h3>
        <p><strong>Broker Fee Charged:</strong> $${broker_fee}</p>
        <p><strong>Deducted From Deposit:</strong> $${locked_amount}</p>

        <hr />

        <h3>🚗 Pickup / Shipping</h3>
        <p>Your vehicle will be ready for pickup once Copart confirms payment.</p>

        <p>
          <a href="https://v6autobroker.com/shipping"
             style="background:#4CAF50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">
             Request Shipping Quote
          </a>
        </p>

        <hr />

        <p>If you need help, simply reply to this email.</p>
        <p><strong>V6 Auto Broker</strong> — Buy Like a Dealer.</p>

      </div>
    `;

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user_email,
      subject: `🎉 You Won Lot #${lot_number}! Payment Required`,
      html,
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

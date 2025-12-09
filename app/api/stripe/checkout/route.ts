import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// MUST use this version (your Stripe TS types only accept this)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { planName, amount } = await req.json();

    if (!planName || !amount) {
      return NextResponse.json(
        { error: "Missing planName or amount" },
        { status: 400 }
      );
    }

    const priceInCents = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?plan=${planName}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown Stripe error";

    console.error("❌ Stripe Checkout Error:", message);

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

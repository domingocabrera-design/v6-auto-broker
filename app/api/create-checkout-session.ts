import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe MUST use this API version based on your TS definition
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { priceId, successUrl, cancelUrl } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing priceId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: successUrl || "https://v6autobroker.com/success",
      cancel_url: cancelUrl || "https://v6autobroker.com/cancel",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown server error";

    console.error("❌ Checkout Session Error:", message);

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

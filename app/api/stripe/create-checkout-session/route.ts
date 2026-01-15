import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { priceId, successUrl, cancelUrl } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing priceId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        successUrl ??
        `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
      cancel_url:
        cancelUrl ??
        `${process.env.NEXT_PUBLIC_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("❌ STRIPE CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "Stripe error" },
      { status: 500 }
    );
  }
}

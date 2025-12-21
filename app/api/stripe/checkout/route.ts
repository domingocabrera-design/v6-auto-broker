import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { enforceNotFrozen } from "@/lib/enforceNotFrozen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, userId, email } = body;

    if (!priceId || !userId || !email) {
      return NextResponse.json(
        { error: "Missing priceId, userId, or email" },
        { status: 400 }
      );
    }

    /* ───── FREEZE CHECK (CRITICAL) ───── */
    const freeze = await enforceNotFrozen(userId);

    if (!freeze.allowed) {
      return NextResponse.json(
        { error: freeze.reason },
        { status: 403 }
      );
    }

    /* ───── CREATE STRIPE CUSTOMER ───── */
    const customer = await stripe.customers.create({
      email,
      metadata: { user_id: userId },
    });

    /* ───── CHECKOUT SESSION ───── */
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          user_id: userId,
        },
      },
      payment_method_collection: "always",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?trial=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("STRIPE CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Stripe checkout failed" },
      { status: 500 }
    );
  }
}

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ Use a STABLE Stripe API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🟢 Checkout request body:", body);

    const { priceId, userId, email } = body;

    if (!priceId || !userId || !email) {
      console.error("🔴 Missing required fields");
      return NextResponse.json(
        { error: "Missing priceId, userId, or email" },
        { status: 400 }
      );
    }

    /* ───────────────────────────────────── */
    /* CREATE STRIPE CUSTOMER */
    /* ───────────────────────────────────── */
    const customer = await stripe.customers.create({
      email,
      metadata: {
        user_id: userId, // must match auth.users.id
      },
    });

    console.log("✅ Stripe customer created:", customer.id);

    /* ───────────────────────────────────── */
    /* CREATE CHECKOUT SESSION (SUBSCRIPTION) */
    /* ───────────────────────────────────── */
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      customer: customer.id,

      line_items: [
        {
          price: priceId, // MUST be a valid Stripe PRICE ID
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

    console.log("🎉 Checkout session created:", session.id);
    console.log("🔗 Checkout URL:", session.url);

    return NextResponse.json(
      { url: session.url },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ STRIPE CHECKOUT ERROR FULL:", err);

    return NextResponse.json(
      {
        error: err?.message || "Stripe checkout failed",
      },
      { status: 500 }
    );
  }
}

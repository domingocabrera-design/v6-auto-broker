import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe MUST use this API version (your TS types require it)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // Stripe requires raw body
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid webhook signature";
      console.error("❌ Webhook Signature Error:", message);

      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    console.log("🔔 Stripe Webhook Event:", event.type);

    // -----------------------------
    // HANDLE EVENTS
    // -----------------------------

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("💰 Checkout session completed:", session.id);

      // Example: update subscription or record payment
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;

      console.log("✅ Invoice paid:", invoice.id);

      // Optional: update Supabase with payment status
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;

      console.log("🔄 Subscription updated:", subscription.id);

      // Optional: sync subscription data to Supabase
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown webhook processing error";

    console.error("❌ Stripe Webhook Error:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

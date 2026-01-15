import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * IMPORTANT:
 * - Do NOT set apiVersion
 * - Stripe SDK pins the API version internally
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/* SERVICE ROLE CLIENT (BYPASSES RLS) */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();

  // ✅ FIX: headers() is async in Next.js 16
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Invalid Stripe signature";

    console.error("❌ Invalid Stripe signature:", message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  console.log("🔔 Stripe event:", event.type);

  /* ───────── CHECKOUT COMPLETED ───────── */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const subscriptionId = session.subscription as string | null;
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const userId = subscription.metadata?.user_id;
      const plan = subscription.metadata?.plan;

      if (userId && plan) {
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            trial_ends_at: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        console.log("✅ Subscription created:", plan);
      }
    }
  }

  /* ───────── SUBSCRIPTION CREATED / UPDATED ───────── */
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const sub = event.data.object as Stripe.Subscription;

    const userId = sub.metadata?.user_id;
    const plan = sub.metadata?.plan;

    if (userId && plan) {
      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          plan,
          stripe_subscription_id: sub.id,
          stripe_customer_id: sub.customer as string,
          status: sub.status,
          trial_ends_at: sub.trial_end
            ? new Date(sub.trial_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      console.log("🔄 Subscription synced:", plan, sub.status);
    }
  }

  /* ───────── SUBSCRIPTION CANCELED ───────── */
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.user_id;

    if (userId) {
      await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      console.log("🛑 Subscription canceled");
    }
  }

  return NextResponse.json({ received: true });
}

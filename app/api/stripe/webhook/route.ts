import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ STABLE STRIPE API VERSION
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

// ✅ SERVICE ROLE CLIENT (SERVER ONLY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  console.log("🔔 Stripe event:", event.type);

  /* ───────────────────────────────────── */
  /* SUBSCRIPTION CREATED / UPDATED */
  /* ───────────────────────────────────── */
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata.user_id;

    if (!userId) {
      console.warn("⚠️ Subscription missing user_id metadata");
      return NextResponse.json({ received: true });
    }

    await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: sub.customer as string,
      status: sub.status, // trialing | active | past_due | canceled
      trial_ends_at: sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    });

    console.log("✅ Subscription synced:", sub.id, sub.status);
  }

  /* ───────────────────────────────────── */
  /* SUBSCRIPTION CANCELED */
  /* ───────────────────────────────────── */
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata.user_id;

    if (userId) {
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("user_id", userId);

      console.log("🛑 Subscription canceled:", sub.id);
    }
  }

  return NextResponse.json({ received: true });
}

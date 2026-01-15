import Stripe from "stripe";
import { NextResponse } from "next/server";
import { STRIPE_PRICES } from "@/lib/stripePrices";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * IMPORTANT:
 * - Do NOT pass apiVersion (Stripe SDK pins it internally)
 * - Wrap cookies in Promise.resolve for Next.js 16
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    /* ───── AUTH ───── */
    const cookieStore = cookies();

    const supabase = createRouteHandlerClient({
      cookies: () => Promise.resolve(cookieStore),
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    /* ───── BODY ───── */
    const { plan } = await req.json();

    const selectedPlan =
      STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES];

    if (!selectedPlan) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    /* ───── STRIPE CHECKOUT ───── */
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?cancelled=1`,
      metadata: {
        user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan,
        },
        trial_period_days: 7,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("❌ STRIPE CHECKOUT ERROR:", err);

    const message =
      err instanceof Error ? err.message : "Stripe checkout failed";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

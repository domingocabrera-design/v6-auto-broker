import Stripe from "stripe";

/**
 * Stripe server instance
 * Next.js 16 + React 19 SAFE
 * LOCKED – DO NOT MODIFY
 */
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: "2025-11-17.clover",
    typescript: true,
  }
);

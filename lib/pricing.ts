export const PRICING_PLANS = {
  starter: {
    name: "Starter",
    price: 29.99,
    stripePriceId: "price_29_99_price_1SqMxdQnzC2oExl4PmgOg0Hi", // ← FROM STRIPE
    bidLimit: 5,
  },
  pro: {
    name: "Pro",
    price: 39.99,
    stripePriceId: "price_39_99_price_1SqMx6QnzC2oExl4DAjpopIb", // ← FROM STRIPE
    bidLimit: 10,
  },
  elite: {
    name: "Elite",
    price: 49.99,
    stripePriceId: "price_49_99_price_1SeodNQnzC2oExl4bQ3BWWJT", // ← FROM STRIPE
    bidLimit: Infinity,
  },
} as const;

export type PlanKey = keyof typeof PRICING_PLANS;

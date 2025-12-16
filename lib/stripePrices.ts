export const STRIPE_PRICES = {
  single: {
    name: "Single Car Plan",
    priceId: "price_1REAL249ID", // 👈 from Stripe
    amount: 249,
  },
  three: {
    name: "3 Cars Plan",
    priceId: "price_1REAL599ID",
    amount: 599,
  },
  five: {
    name: "5 Cars Plan",
    priceId: "price_1REAL899ID",
    amount: 899,
  },
  ten: {
    name: "10 Cars Plan",
    priceId: "price_1REAL1299ID",
    amount: 1299,
  },
} as const;

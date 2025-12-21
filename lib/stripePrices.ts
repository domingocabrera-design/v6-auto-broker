export const STRIPE_PRICES = {
  single: {
    name: "Single Car Plan",
    priceId: "price_1SeocdQnzC2oExl4WIEokbBU",
    amount: 249,
    limit: 1,
  },
  three: {
    name: "3 Cars Plan",
    priceId: "price_1SeocrQnzC2oExl4zOSb0ams",
    amount: 599,
    limit: 3,
  },
  five: {
    name: "5 Cars Plan",
    priceId: "price_1Seod5QnzC2oExl4dbIxVEXD",
    amount: 899,
    limit: 5,
  },
  ten: {
    name: "10 Cars Plan",
    priceId: "price_1SeodNQnzC2oExl4bQ3BWWJT",
    amount: 1299,
    limit: 10,
  },
} as const;

export type StripePlanKey = keyof typeof STRIPE_PRICES;

"use client";

import { useState } from "react";

/* ================= MAIN PAGE ================= */
export default function PricingEnPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function selectPlan(plan: "single" | "three" | "five" | "ten") {
    try {
      setLoadingPlan(plan);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        alert(data.error || "Checkout failed");
        setLoadingPlan(null);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">

      {/* ================= HEADER ================= */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          V6 Auto Broker Pricing
        </h1>
        <p className="text-gray-400 text-lg">
          Simple, transparent access to dealer-only auctions.
        </p>
      </div>

      {/* ================= PLANS ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        <PlanCard
          title="Single Vehicle Access"
          price="$249 / month"
          subtitle="Best for first-time buyers"
          planKey="single"
          loadingPlan={loadingPlan}
          onSelect={selectPlan}
          features={[
            "Full platform access",
            "Buy up to 1 vehicle",
            "Basic support",
            "Damage review",
            "Guided bidding process",
          ]}
          perCar={[
            "Total fee per vehicle won: $349",
            "$200 – Broker service fee",
            "$150 – Title & handling",
          ]}
        />

        <PlanCard
          title="3-Car Pro Access"
          price="$599 / month"
          subtitle="Best value"
          highlight
          planKey="three"
          loadingPlan={loadingPlan}
          onSelect={selectPlan}
          features={[
            "Buy up to 3 vehicles",
            "Priority support",
            "Fast approval",
            "Discounted fees",
            "Market guidance",
          ]}
          perCar={[
            "Total fee per vehicle won: $250",
            "$150 – Broker service fee",
            "$100 – Title & handling",
          ]}
        />

        <PlanCard
          title="5-Car Elite Access"
          price="$899 / month"
          subtitle="Frequent buyers"
          planKey="five"
          loadingPlan={loadingPlan}
          onSelect={selectPlan}
          features={[
            "Buy up to 5 vehicles",
            "VIP support",
            "Early access",
            "Paperwork assistance",
            "Transport coordination",
          ]}
          perCar={[
            "Total fee per vehicle won: $250",
            "$150 – Broker service fee",
            "$100 – Title & handling",
          ]}
        />

        <PlanCard
          title="10-Car Dealer Plan"
          price="$1,299 / month"
          subtitle="High-volume buyers"
          planKey="ten"
          loadingPlan={loadingPlan}
          onSelect={selectPlan}
          features={[
            "Buy up to 10 vehicles",
            "Premium support",
            "Personal advisor",
            "Priority access",
            "Advanced tools",
          ]}
          perCar={[
            "Total fee per vehicle won: $250",
            "$150 – Broker service fee",
            "$100 – Title & handling",
          ]}
        />
      </div>

      {/* ================= NOTES ================= */}
      <div className="max-w-4xl mx-auto mt-20 text-gray-400 text-sm leading-relaxed">
        <p className="mb-3">
          • Subscriptions are for platform access only and are non-refundable.
        </p>
        <p className="mb-3">
          • Broker fees apply only if a vehicle is successfully won.
        </p>
        <p className="mb-3">
          • All vehicles are sold <strong>AS-IS, WHERE-IS</strong>.
        </p>
        <p className="mb-3">
          • Vehicle price, auction fees, taxes, shipping, and export costs are not included.
        </p>
        <p>
          • Shipping coordination and export assistance are optional services with additional cost.
        </p>
      </div>

    </div>
  );
}

/* ================= PLAN CARD ================= */
function PlanCard({
  title,
  price,
  subtitle,
  features,
  perCar,
  planKey,
  loadingPlan,
  onSelect,
  highlight,
}: {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  perCar: string[];
  planKey: "single" | "three" | "five" | "ten";
  loadingPlan: string | null;
  onSelect: (plan: "single" | "three" | "five" | "ten") => void;
  highlight?: boolean;
}) {
  const isLoading = loadingPlan === planKey;

  return (
    <div
      className={`
        relative bg-[#0f0f0f] border border-gray-700 rounded-2xl p-8 shadow-lg
        ${highlight ? "scale-105 border-blue-500 shadow-blue-900/40" : ""}
      `}
    >
      {highlight && (
        <div className="absolute -top-3 right-6 bg-blue-600 text-black text-xs font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}

      <h3 className="text-2xl font-bold mb-1">{title}</h3>
      <p className="text-blue-400 font-extrabold text-4xl mb-2">{price}</p>
      <p className="text-gray-400 text-sm mb-6">{subtitle}</p>

      <ul className="space-y-2 text-sm mb-6">
        {features.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>

      <div className="border-t border-gray-700 pt-4 text-sm text-gray-300">
        {perCar.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <button
        onClick={() => onSelect(planKey)}
        disabled={isLoading}
        className={`
          mt-6 w-full py-3 rounded-xl font-bold transition
          ${
            isLoading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-black hover:bg-blue-500"
          }
        `}
      >
        {isLoading ? "Redirecting…" : "Select Plan"}
      </button>
    </div>
  );
}

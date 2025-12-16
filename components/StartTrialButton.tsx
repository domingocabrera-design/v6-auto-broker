"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { STRIPE_PRICES } from "@/lib/stripePrices";

type PlanKey = keyof typeof STRIPE_PRICES;

export default function StartTrialButton({ plan }: { plan: PlanKey }) {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase]);

  async function startTrial() {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: STRIPE_PRICES[plan].priceId,
        userId: user.id,
        email: user.email,
      }),
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Unable to start free trial");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={startTrial}
      disabled={loading}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
    >
      {loading ? "Redirecting…" : "Start 7-Day Free Trial"}
    </button>
  );
}

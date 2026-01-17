"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PRICING_PLANS, PricingPlanKey } from "@/lib/pricing";

export default function SubscribeButton({ plan }: { plan: PricingPlanKey }) {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase]);

  async function subscribe() {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Unable to start subscription");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={subscribe}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
    >
      {loading ? "Redirecting…" : "Subscribe"}
    </button>
  );
}

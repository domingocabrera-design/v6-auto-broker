"use client";

import { useEffect, useState } from "react";

type Subscription = {
  status: string;
  trial_ends_at: string | null;
};

export default function TrialBanner({
  subscription,
}: {
  subscription: Subscription | null;
}) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (
      subscription?.status === "trialing" &&
      subscription.trial_ends_at
    ) {
      const now = new Date();
      const end = new Date(subscription.trial_ends_at);
      const diff = Math.ceil(
        (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      setDaysLeft(diff > 0 ? diff : 0);
    }
  }, [subscription]);

  if (!subscription || subscription.status !== "trialing") {
    return null;
  }

  return (
    <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-300 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h3 className="font-bold text-lg">🎉 Free Trial Active</h3>
        <p className="text-sm mt-1">
          {daysLeft} day{daysLeft === 1 ? "" : "s"} remaining.
          <br />
          Bidding unlocks when your subscription becomes active.
        </p>
      </div>

      <a
        href="/pricing"
        className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
        Upgrade Now
      </a>
    </div>
  );
}

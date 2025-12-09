"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function BidStatusListener() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    console.log("🔌 Listener mounted — waiting for ANY bid updates…");

    const channel = supabase
      .channel("bids-updates")   // ✅ SIMPLE, SAFE CHANNEL NAME
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bids",          // ✅ MUST MATCH EXACT TABLE NAME
        },
        async (payload) => {
          const bid = payload.new;
          console.log("🔥 BID UPDATED:", bid);

          // Only run auto-actions when won
          if (bid.status === "won") {
            console.log("🏁 Bid status changed to WON!");

            // Auto deduct
            try {
              const res = await fetch("/api/bids/auto-deduct", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bid),
              });

              console.log("💰 Auto Deduct:", await res.json());
            } catch (e) {
              console.error("❌ Auto Deduct Error:", e);
            }

            // Email
            try {
              const res = await fetch("/api/email/win-notification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bid),
              });

              console.log("📧 Email Result:", await res.json());
            } catch (e) {
              console.error("❌ Email Error:", e);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      console.log("🔌 Listener unmounted");
    };
  }, []);

  return null;
}

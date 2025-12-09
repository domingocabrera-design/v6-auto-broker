"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function BidStatusListener() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    console.log("🔌 BidStatusListener mounted… waiting for updates");

    const channel = supabase
      .channel("bids-won")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bids",
          filter: "status=eq.won",
        },
        (payload) => {
          console.log("🏁 Bid Won (Realtime):", payload);
        }
      )
      .subscribe();

    // ❗ React cleanup CANNOT be async
    // So we return a synchronous function and manually call the async unsubscribe
    return () => {
      console.log("🔌 Cleanup BidStatusListener…");

      // Fire and forget — we do NOT return a Promise
      channel.unsubscribe().catch((err) => {
        console.error("Failed to unsubscribe channel:", err);
      });
    };
  }, [supabase]);

  return null;
}

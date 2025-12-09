import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function BidStatusListener() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const channel = supabase
      .channel("bids-won-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bids",
          filter: "status=eq.won",
        },
        async (payload) => {
          console.log("🚗 Bid WON:", payload.new);

          await fetch("/api/email/win-notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload.new),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}

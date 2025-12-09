"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function BidHistoryPage() {
  const supabase = createClientComponentClient();

  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBids();
  }, []);

  async function loadBids() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("request_buy")  // ✔ REAL TABLE
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setBids(data);
    setLoading(false);
  }

  if (loading)
    return <div className="p-6 text-gray-400">Loading bid history…</div>;

  return (
    <div className="p-10 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Your Bid History</h1>

      {bids.length === 0 && (
        <div className="text-gray-400 text-lg">No bids yet.</div>
      )}

      <div className="space-y-4">
        {bids.map((bid: any, i) => (
          <div
            key={i}
            className="bg-[#1b1c1f] p-6 rounded-xl border border-gray-700"
          >
            <p className="font-bold text-xl">Lot #{bid.lot_id}</p>

            <p className="text-gray-400">{bid.lot_url}</p>

            <p className="mt-2">
              <span className="text-gray-400">Bid Amount:</span>{" "}
              <span className="text-green-400 font-bold">
                ${bid.bid_amount}
              </span>
            </p>

            <p>
              <span className="text-gray-400">Locked Deposit:</span>{" "}
              <span className="text-yellow-400 font-bold">
                ${bid.deposit_locked}
              </span>
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Submitted: {new Date(bid.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

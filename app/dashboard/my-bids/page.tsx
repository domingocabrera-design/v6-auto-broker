"use client";

import { useEffect, useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function MyBidsPage() {
  const supabase = createClientComponentClient();

  const [bids, setBids] = useState<any[]>([]);
  const [lotInfo, setLotInfo] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const lastStatuses = useRef<Record<string, string>>({});

  // Sounds
  const outbidSound = typeof Audio !== "undefined" ? new Audio("/sounds/outbid.mp3") : null;
  const winSound = typeof Audio !== "undefined" ? new Audio("/sounds/win.mp3") : null;

  // Load bids
  async function loadBids() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("bids")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return data || [];
  }

  // Load Copart preview
  async function loadLot(lotId: string) {
    const res = await fetch(`/api/copart/live/${lotId}`);
    const json = await res.json();
    if (json.success) {
      setLotInfo((prev) => ({ ...prev, [lotId]: json.lot }));
    }
  }

  // INITIAL LOAD
  useEffect(() => {
    (async () => {
      setLoading(true);
      const list = await loadBids();
      setBids(list);
      list.forEach((b) => loadLot(b.lot_id));
      setLoading(false);
    })();
  }, []);

  // AUTO REFRESH + ALERTS
  useEffect(() => {
    const interval = setInterval(async () => {
      const newBids = await loadBids();
      if (!newBids) return;

      // Detect status changes
      newBids.forEach((newBid) => {
        const oldStatus = lastStatuses.current[newBid.id];
        const newStatus = newBid.status;

        if (oldStatus && oldStatus !== newStatus) {
          // Outbid alert
          if (newStatus === "Outbid") {
            outbidSound?.play();
            flashEffect(newBid.id, "red");
          }

          // Winning alert
          if (newStatus === "Winning") {
            winSound?.play();
            flashEffect(newBid.id, "green");
          }
        }

        lastStatuses.current[newBid.id] = newStatus;

        // Update car info too
        loadLot(newBid.lot_id);
      });

      setBids(newBids);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // FLASH EFFECT
  function flashEffect(bidId: string, color: "green" | "red") {
    const el = document.getElementById(`bid-${bidId}`);
    if (!el) return;

    if (color === "green") el.classList.add("flash-green");
    else el.classList.add("flash-red");

    setTimeout(() => {
      el.classList.remove("flash-green");
      el.classList.remove("flash-red");
    }, 900);
  }

  // CANCEL BID
  async function cancelBid(bid_id: string) {
    const res = await fetch("/api/bids/cancel", {
      method: "POST",
      body: JSON.stringify({ bid_id }),
    });

    const json = await res.json();
    if (json.success) {
      alert("Bid cancelled + deposit unlocked!");
      const updated = await loadBids();
      setBids(updated);
    }
  }

  // INCREASE BID BUTTON LOGIC
  async function increaseBid(bid: any) {
    const newAmount = Number(bid.bid_amount) + 100;

    const res = await fetch("/api/bids/place", {
      method: "POST",
      body: JSON.stringify({
        lot_id: bid.lot_id,
        bid_amount: newAmount,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      alert(json.error || "Unable to increase bid");
      return;
    }

    alert("Bid increased successfully!");

    const updated = await loadBids();
    setBids(updated);
  }

  return (
    <div className="ml-64 p-8 text-gray-100 min-h-screen bg-[#0f0f0f]">

      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        My Live Bids
      </h1>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-6">
          {bids.map((bid) => {
            const lot = lotInfo[bid.lot_id];

            return (
              <div
                key={bid.id}
                id={`bid-${bid.id}`}
                className="bg-[#1b1c1f] p-6 rounded-2xl border border-gray-700 shadow-xl space-y-4 transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold">Lot #{bid.lot_id}</p>
                    <p className="text-sm text-gray-400">
                      Placed: {new Date(bid.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-xl text-sm font-semibold ${
                      bid.status === "Winning"
                        ? "bg-green-600"
                        : bid.status === "Outbid"
                        ? "bg-red-600"
                        : bid.status === "Cancelled"
                        ? "bg-gray-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>

                {/* Copart Info */}
                {lot ? (
                  <div className="flex gap-6 bg-[#111214] p-4 rounded-xl border border-gray-700">
                    <img
                      src={lot.image}
                      className="w-40 h-28 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-bold text-lg">
                        {lot.year} {lot.make} {lot.model}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {lot.odometer} miles • {lot.location}
                      </p>
                      <p className="text-blue-400 font-semibold">
                        Current Bid: ${lot.currentBid}
                      </p>
                      <p className="text-purple-400 text-sm">
                        Ends: {lot.endTimeFormatted}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Loading vehicle info…</p>
                )}

                {/* Bid Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Your Max Bid</p>
                    <p className="font-bold text-blue-400">
                      ${Number(bid.bid_amount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Locked Deposit</p>
                    <p className="font-bold text-purple-400">
                      ${Number(bid.locked_amount).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-4">
                  {bid.status !== "Cancelled" && (
                    <>
                      <button
                        onClick={() => increaseBid(bid)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-sm"
                      >
                        Increase Bid (+$100)
                      </button>

                      <button
                        onClick={() => cancelBid(bid.id)}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-sm"
                      >
                        Cancel Bid
                      </button>
                    </>
                  )}

                  {bid.status === "Cancelled" && (
                    <p className="text-gray-500 italic">Bid cancelled</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

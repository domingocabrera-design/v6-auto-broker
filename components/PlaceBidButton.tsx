"use client";

import { useState } from "react";

/* -------------------------------- TYPES -------------------------------- */

type PlaceBidButtonProps = {
  lot_id: string;
  lot_price: number;
};

type UpgradeData = {
  current_plan?: string;
  max_bids?: number;
  suggested_plan?: string;
};

/* ------------------------------ COMPONENT ------------------------------ */

export default function PlaceBidButton({
  lot_id,
  lot_price,
}: PlaceBidButtonProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Upgrade modal state
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeData, setUpgradeData] = useState<UpgradeData | null>(null);

  /* ---------------------------- PLACE BID ---------------------------- */

  async function submitBid() {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid bid amount.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bids/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lot_id,
          bid_amount: Number(amount),
        }),
      });

      const data = await res.json();

      /* ---------- 🔒 BID LIMIT HIT ---------- */
      if (!data.success && data.code === "LIMIT_REACHED") {
        setUpgradeData(data);
        setShowUpgrade(true);
        return;
      }

      /* ---------- OTHER ERRORS ---------- */
      if (!data.success) {
        alert(data.error || "Bid failed.");
        return;
      }

      alert("✅ Bid placed successfully!");
      setAmount("");
    } catch (err) {
      alert("Error placing bid.");
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------- UI ------------------------------- */

  return (
    <>
      <div className="p-4 bg-[#202020] rounded-xl text-white space-y-3">
        <h3 className="text-lg font-bold">Place a Bid</h3>

        <p className="text-sm text-gray-300">
          Current Price: ${lot_price}
        </p>

        <input
          type="number"
          placeholder="Enter your bid"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 bg-black rounded outline-none"
        />

        <button
          disabled={loading}
          onClick={submitBid}
          className="w-full py-2 bg-blue-600 rounded-xl disabled:bg-gray-600"
        >
          {loading ? "Submitting..." : "Place Bid"}
        </button>
      </div>

      {/* ===================== 🔥 UPGRADE MODAL ===================== */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#111] p-6 rounded-xl w-full max-w-md text-white space-y-4">
            <h2 className="text-xl font-bold text-center">
              🚀 Upgrade Required
            </h2>

            <p className="text-sm text-gray-300 text-center">
              You’ve reached your bid limit.
            </p>

            {upgradeData && (
              <div className="text-sm text-gray-400 space-y-1">
                <p>Current plan: <b>{upgradeData.current_plan}</b></p>
                <p>Max bids allowed: <b>{upgradeData.max_bids}</b></p>
                <p>
                  Recommended upgrade:{" "}
                  <b className="text-green-400">
                    {upgradeData.suggested_plan}
                  </b>
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => {
                  window.location.href = "/pricing";
                }}
                className="flex-1 py-2 bg-green-600 rounded-xl"
              >
                Upgrade Now
              </button>

              <button
                onClick={() => setShowUpgrade(false)}
                className="flex-1 py-2 bg-gray-700 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

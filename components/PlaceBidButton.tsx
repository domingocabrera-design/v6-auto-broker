"use client";

import { useState } from "react";

type PlaceBidButtonProps = {
  lot_id: string;
  lot_price: number;
};

export default function PlaceBidButton({ lot_id, lot_price }: PlaceBidButtonProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitBid() {
    if (!amount) {
      alert("Enter your bid amount.");
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

      if (!data.success) {
        alert("Bid failed: " + data.error);
      } else {
        alert("Bid placed successfully!");
      }
    } catch (err: any) {
      alert("Error placing bid.");
    }

    setLoading(false);
  }

  return (
    <div className="p-4 bg-[#202020] rounded-xl text-white space-y-3">
      <h3 className="text-lg font-bold">Place a Bid</h3>

      <p className="text-sm text-gray-300">Current Price: ${lot_price}</p>

      <input
        type="number"
        placeholder="Enter your bid"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 bg-black rounded"
      />

      <button
        disabled={loading}
        onClick={submitBid}
        className="w-full py-2 bg-blue-600 rounded-xl disabled:bg-gray-600"
      >
        {loading ? "Submitting..." : "Place Bid"}
      </button>
    </div>
  );
}

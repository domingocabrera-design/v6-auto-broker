"use client";

import { useState } from "react";

type ProfitCalculatorProps = {
  marketValue: number;
};

export default function ProfitCalculator({ marketValue }: ProfitCalculatorProps) {
  const [bid, setBid] = useState("");
  const [shipping, setShipping] = useState("0");
  const [repairCost, setRepairCost] = useState("0");
  const [profit, setProfit] = useState<number | null>(null);

  function calculate() {
    const bidNum = Number(bid);
    const shipNum = Number(shipping);
    const repairNum = Number(repairCost);

    const totalCost = bidNum + shipNum + repairNum;
    const estimatedProfit = marketValue - totalCost;

    setProfit(estimatedProfit);
  }

  return (
    <div className="p-4 bg-[#1c1c1c] rounded-xl text-white space-y-4">
      <h2 className="text-xl font-bold">Profit Calculator</h2>

      <p>Market Value: ${marketValue}</p>

      <input
        type="number"
        placeholder="Your Bid"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        className="w-full p-2 bg-black rounded"
      />

      <input
        type="number"
        placeholder="Shipping Cost"
        value={shipping}
        onChange={(e) => setShipping(e.target.value)}
        className="w-full p-2 bg-black rounded"
      />

      <input
        type="number"
        placeholder="Repair Cost"
        value={repairCost}
        onChange={(e) => setRepairCost(e.target.value)}
        className="w-full p-2 bg-black rounded"
      />

      <button
        onClick={calculate}
        className="w-full py-2 bg-blue-600 rounded-xl"
      >
        Calculate Profit
      </button>

      {profit !== null && (
        <div className="pt-3">
          <p>
            Estimated Profit:{" "}
            <span className={profit >= 0 ? "text-green-400" : "text-red-400"}>
              ${profit}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

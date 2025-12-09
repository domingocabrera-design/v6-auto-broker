"use client";

import { useState } from "react";

type DealAnalyzerProps = {
  lot: {
    currentBid: number;
    year?: number;
    make?: string;
    model?: string;
    mileage?: number;
    primary_damage?: string;
    // Add more fields if your lot object has more
  };
  marketValue: number;
};

export default function DealAnalyzer({ lot, marketValue }: DealAnalyzerProps) {
  const [bid, setBid] = useState(lot.currentBid);
  const [analysis, setAnalysis] = useState<any>(null);

  function calculate() {
    const score = marketValue - bid;
    setAnalysis({
      score,
      goodDeal: score > 1000,
    });
  }

  return (
    <div className="p-4 bg-[#111] rounded-xl text-white space-y-4">
      <h2 className="text-xl font-bold">Deal Analyzer</h2>

      <p>Market Value: ${marketValue}</p>

      <input
        type="number"
        className="bg-black p-2 rounded"
        value={bid}
        onChange={(e) => setBid(Number(e.target.value))}
      />

      <button
        onClick={calculate}
        className="px-4 py-2 bg-green-600 rounded"
      >
        Analyze Deal
      </button>

      {analysis && (
        <div className="pt-2">
          <p>Score: {analysis.score}</p>
          <p>
            Deal Status:{" "}
            {analysis.goodDeal ? (
              <span className="text-green-400">Good Deal</span>
            ) : (
              <span className="text-red-400">Bad Deal</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

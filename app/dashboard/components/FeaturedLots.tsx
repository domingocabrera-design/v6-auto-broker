"use client";

import { useEffect, useState } from "react";

export default function FeaturedLots({ lotIds }: { lotIds: string[] }) {
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLots();
  }, []);

  async function loadLots() {
    const result = [];

    for (const id of lotIds) {
      const res = await fetch(`/api/copart/live/${id}`);
      const data = await res.json();

      if (data.success) result.push(data.lot);
    }

    setLots(result);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="bg-[#1b1c1f] p-6 rounded-xl border border-gray-700">
        <p className="text-gray-400">Loading featured lots...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1b1c1f] p-6 rounded-xl border border-gray-700 space-y-4">
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Featured Copart Lots
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lots.map((lot: any, i) => (
          <div key={i} className="bg-[#111214] rounded-xl overflow-hidden border border-gray-800 shadow-lg">
            <img
              src={lot.image}
              className="w-full h-48 object-cover"
              alt="lot"
            />

            <div className="p-4 space-y-1">
              <p className="font-bold">{lot.year} {lot.make} {lot.model}</p>
              <p className="text-gray-400 text-sm">Lot #{lot.lotNumber}</p>
              <p className="text-gray-400 text-sm">
                {lot.odometer} mi • {lot.location}
              </p>

              <p className="text-blue-400 font-semibold">
                Current Bid: ${lot.currentBid ?? "N/A"}
              </p>

              <p className="text-purple-400 text-sm">
                Auction Ends: {lot.endTimeFormatted}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

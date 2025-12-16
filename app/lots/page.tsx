"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import getLotImage from "@/lib/getLotImage";
import BidStatusListener from "@/components/BidStatusListener";

export default function LotPage({ params }: { params: { lotId: string } }) {
  const { lotId } = params;

  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* --------------------------------------------------
   * LOAD LOT
   * -------------------------------------------------- */
  useEffect(() => {
    async function loadLot() {
      try {
        const res = await fetch(`/api/copart/live/${lotId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!data.success) {
          setError("Copart blocked the request. Try again shortly.");
        } else {
          setLot(data.data?.data || data.data);
        }
      } catch {
        setError("Could not load lot information.");
      }

      setLoading(false);
    }

    loadLot();
  }, [lotId]);

  /* --------------------------------------------------
   * STATES
   * -------------------------------------------------- */
  if (loading)
    return (
      <div className="text-center py-24 text-gray-300 text-xl">Loading…</div>
    );

  if (error)
    return (
      <div className="text-center py-24 text-red-500 text-xl">{error}</div>
    );

  if (!lot)
    return (
      <div className="text-center py-24 text-red-500 text-xl">
        Lot not found
      </div>
    );

  const img = getLotImage(lot);

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <BidStatusListener />

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">
        {lot.lotNumberStr} — {lot.lotYear} {lot.make} {lot.model}
      </h1>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Car Image */}
        <div className="bg-black p-2 rounded-xl shadow-lg">
          <Image
            src={img}
            alt="Car image"
            width={1000}
            height={600}
            className="rounded-lg object-cover w-full"
          />
        </div>

        {/* Info Section */}
        <div className="bg-[#111] p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Vehicle Details</h2>

          <div className="space-y-3 text-gray-300">
            <p>
              <span className="text-white">VIN:</span> {lot.vin}
            </p>
            <p>
              <span className="text-white">Odometer:</span>{" "}
              {lot.odometer?.value} {lot.odometer?.unit}
            </p>
            <p>
              <span className="text-white">Damage:</span>{" "}
              {lot.damageDescription || "N/A"}
            </p>
            <p>
              <span className="text-white">Title:</span>{" "}
              {lot.titleType || "N/A"}
            </p>
            <p>
              <span className="text-white">Current Bid:</span>{" "}
              <span className="text-green-400 font-bold text-xl">
                ${lot.currentBid || 0}
              </span>
            </p>
            <p>
              <span className="text-white">Sale Date:</span>{" "}
              {lot.auctionDate || "N/A"}
            </p>
          </div>

          {/* Bid box */}
          <div className="mt-6">
            <input
              type="number"
              placeholder="Enter your bid"
              className="w-full p-3 rounded-lg text-black"
            />

            <button className="mt-4 w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg">
              PLACE BID
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-10 bg-[#0d0d0d] p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-3">Additional Info</h2>

        <p className="text-gray-300">
          Seller: <span className="text-white">{lot.seller || "Unknown"}</span>
        </p>

        <p className="text-gray-300 mt-2">
          Highlights:{" "}
          <span className="text-white">{lot.highlights || "N/A"}</span>
        </p>

        <p className="text-gray-300 mt-2">
          Notes: <span className="text-white">{lot.lotCondition || "None"}</span>
        </p>
      </div>
    </div>
  );
}

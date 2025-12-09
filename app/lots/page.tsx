"use client";

import { useEffect, useState } from "react";

export default function LotPage(props: { params: Promise<{ lotId: string }> }) {
  const [lotId, setLotId] = useState<string | null>(null);
  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [flash, setFlash] = useState(false);

  // --------------------------------------
  // FIX PARAMS: unwrap params (Next.js rule)
  // --------------------------------------
  useEffect(() => {
    props.params.then((p) => setLotId(p.lotId));
  }, [props.params]);

  // --------------------------------------
  // FETCH LOT DETAILS
  // --------------------------------------
  useEffect(() => {
    if (!lotId) return;

    const fetchLot = async () => {
      try {
        const res = await fetch(`/api/copart/live/${lotId}`);
        const data = await res.json();
        setLot(data.lot);
        setLoading(false);
      } catch (err) {
        console.error("ERROR FETCHING LOT:", err);
      }
    };

    fetchLot();
    const interval = setInterval(fetchLot, 5000);
    return () => clearInterval(interval);
  }, [lotId]);

  // --------------------------------------
  // TIMER
  // --------------------------------------
  useEffect(() => {
    if (!lot?.auctionEndTime) return;

    const interval = setInterval(() => {
      const end = new Date(lot.auctionEndTime).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Auction Closed");
        return;
      }

      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [lot]);

  // --------------------------------------
  // LOADING STATE
  // --------------------------------------
  if (loading || !lot) {
    return (
      <p className="text-center py-20 text-gray-600">
        Loading lot details…
      </p>
    );
  }

  // --------------------------------------
  // PAGE UI
  // --------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-1">{lot.title}</h1>
      <p className="text-gray-500 mb-8">Lot #{lotId}</p>

      {/* IMAGE PREVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <img
          src={lot.images[0]}
          className="rounded-xl shadow-lg object-cover h-[420px]"
        />
        <div className="grid grid-cols-2 gap-3">
          {lot.images.slice(1, 5).map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              className="rounded-lg shadow-md w-full h-40 object-cover"
            />
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LIVE AUCTION */}
        <div className="border p-6 rounded-xl shadow bg-white">
          <h2 className="text-xl font-bold mb-4">Live Auction</h2>

          <p className={`text-3xl font-bold mb-2 transition-all ${flash ? "text-green-600 scale-110" : "text-blue-700 scale-100"}`}>
            ${lot.currentBid}
          </p>

          <p className="text-sm text-gray-600">Increment: +${lot.bidIncrement}</p>
          <p className="text-sm text-gray-600 mt-2">Status: {lot.saleStatus}</p>

          <p className="text-sm mt-1">
            Time Left: <span className="font-bold text-red-600">{timeLeft}</span>
          </p>

          <a
            href={`/request-buy/${lotId}`}
            className="block bg-black text-white py-3 text-center rounded-lg font-semibold mt-6 hover:bg-gray-900"
          >
            Request a Bid
          </a>

          {lot.buyItNow && (
            <div className="mt-6 bg-green-50 border border-green-300 p-4 rounded-xl">
              <p className="text-green-700 font-bold text-xl">${lot.buyItNow}</p>
              <p className="text-sm text-green-700 mb-3">Buy It Now</p>
              <a
                href={`/request-buy/${lotId}?bin=1`}
                className="block bg-green-600 text-white py-2 rounded-md text-center hover:bg-green-700"
              >
                Buy It Now Request
              </a>
            </div>
          )}
        </div>

        {/* VEHICLE DETAILS */}
        <div className="md:col-span-2 border p-6 rounded-xl shadow bg-white space-y-6">

          <div>
            <h2 className="text-xl font-bold mb-3">Vehicle Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Year:</strong> {lot.year}</p>
              <p><strong>Make:</strong> {lot.make}</p>
              <p><strong>Model:</strong> {lot.model}</p>
              <p><strong>Odometer:</strong> {lot.odometer} miles</p>
              <p><strong>Keys:</strong> {lot.keys ? "Yes" : "No"}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Damage Info</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Primary Damage:</strong> {lot.primaryDamage}</p>
              <p><strong>Secondary:</strong> {lot.secondaryDamage || "None"}</p>
              <p><strong>Condition:</strong> {lot.condition}</p>
              <p><strong>Seller Notes:</strong> {lot.sellerNotes || "None"}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Title</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><strong>VIN:</strong> {lot.vin}</p>
              <p><strong>Type:</strong> {lot.titleType}</p>
              <p><strong>State:</strong> {lot.titleState}</p>
              <p><strong>Brand:</strong> {lot.titleBrand}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

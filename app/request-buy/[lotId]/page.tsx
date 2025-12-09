"use client";

import { useEffect, useState } from "react";

export default function LotPage({ params }: { params: { lotId: string } }) {
  const lotId = params.lotId;

  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [flash, setFlash] = useState(false);

  // =========================================================
  // FETCH LOT DATA
  // =========================================================
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

  useEffect(() => {
    fetchLot();
    const interval = setInterval(fetchLot, 5000);
    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // WEBSOCKET LIVE BID UPDATES
  // =========================================================
  useEffect(() => {
    if (!lot) return;

    const ws = new WebSocket(
      `${window.location.origin.replace("http", "ws")}/api/ws?lotId=${lotId}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.bid && data.bid !== lot.currentBid) {
        setLot((prev: any) => ({ ...prev, currentBid: data.bid }));
        setFlash(true);
        setTimeout(() => setFlash(false), 300);
      }
    };

    return () => ws.close();
  }, [lot]);

  // =========================================================
  // COUNTDOWN TIMER
  // =========================================================
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

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading)
    return <p className="text-center py-20 text-gray-600">Loading lot...</p>;

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-1">{lot.title}</h1>
      <p className="text-gray-500 mb-8">Lot #{lotId}</p>

      {/* IMAGE TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <img
          src={lot.images[0]}
          className="rounded-xl shadow-lg w-full object-cover h-[420px]"
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

      {/* GRID MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ==================== LIVE AUCTION BOX ==================== */}
        <div className="border p-6 rounded-xl shadow bg-white">
          <h2 className="text-xl font-bold mb-4">Live Auction</h2>

          {/* FLASH BID */}
          <p
            className={`text-3xl font-bold mb-2 transition-all duration-300 ${
              flash ? "text-green-600 scale-110" : "text-blue-700 scale-100"
            }`}
          >
            ${lot.currentBid}
          </p>

          <p className="text-sm text-gray-600">
            Increment: +${lot.bidIncrement}
          </p>

          <p className="text-sm text-gray-600 mt-2">
            Status: {lot.saleStatus}
          </p>

          <p className="text-sm mt-1">
            Time Left: <span className="font-bold text-red-600">{timeLeft}</span>
          </p>

          {/* REQUEST BID BUTTON */}
          <a
            href={`/request-buy/${lotId}`}
            className="block w-full mt-6 bg-black text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-900"
          >
            Request a Bid
          </a>

          {/* BUY NOW */}
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

        {/* ==================== VEHICLE DETAILS ==================== */}
        <div className="md:col-span-2 border p-6 rounded-xl shadow bg-white space-y-6">

          {/* BASIC INFO */}
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

          {/* DAMAGE PANEL */}
          <div>
            <h2 className="text-xl font-bold mb-3">Damage Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Primary Damage:</strong> {lot.primaryDamage}</p>
              <p><strong>Secondary Damage:</strong> {lot.secondaryDamage || "None"}</p>
              <p><strong>Condition:</strong> {lot.condition}</p>
              <p><strong>Seller Notes:</strong> {lot.sellerNotes || "None"}</p>
            </div>
          </div>

          {/* TITLE INFO */}
          <div>
            <h2 className="text-xl font-bold mb-3">Title Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>VIN:</strong> {lot.vin}</p>
              <p><strong>Title Type:</strong> {lot.titleType}</p>
              <p><strong>Title State:</strong> {lot.titleState}</p>
              <p><strong>Brand:</strong> {lot.titleBrand}</p>
            </div>
          </div>

          {/* SELLER INFO */}
          <div>
            <h2 className="text-xl font-bold mb-3">Seller Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Seller:</strong> {lot.sellerName}</p>
              <p><strong>Seller Type:</strong> {lot.sellerType}</p>
              <p><strong>Phone:</strong> {lot.sellerPhone}</p>
            </div>
          </div>

          {/* YARD INFO */}
          <div>
            <h2 className="text-xl font-bold mb-3">Yard Location</h2>
            <p className="text-sm"><strong>Yard:</strong> {lot.yard.name}</p>
            <p className="text-sm"><strong>Address:</strong> {lot.yard.address}</p>
            <p className="text-sm">
              <strong>Coordinates:</strong> {lot.yard.lat}, {lot.yard.lon}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

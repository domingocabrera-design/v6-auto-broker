"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LotPage({ params }: { params: { lotId: string } }) {
  const lotId = params.lotId;

  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [flash, setFlash] = useState(false);
  const [mainImg, setMainImg] = useState("");

  // SHIPPING STATES
  const [zip, setZip] = useState("");
  const [ship, setShip] = useState<any>(null);

  // =========================================================
  // FETCH LOT DATA (Matches the normalized API)
  // =========================================================
  const fetchLot = async () => {
    try {
      const res = await fetch(`/api/copart/live/${lotId}`);
      const data = await res.json();

      if (!data.success) return;

      setLot(data.lot);
      setMainImg(data.lot.images[0]);
      setLoading(false);
    } catch (err) {
      console.error("ERROR FETCHING LOT:", err);
    }
  };

  useEffect(() => {
    fetchLot();

    // Auto-refresh every 5 sec
    const interval = setInterval(fetchLot, 5000);
    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // LIVE BID UPDATES VIA FUTURE WEBSOCKET (Optional)
  // =========================================================
  useEffect(() => {
    if (!lot) return;

    // Example only — you’ll add the real WS later
    // ws.onmessage = ...
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
  // SHIPPING CALCULATOR (Works with your APIs)
  // =========================================================
  const calculateShipping = async () => {
    setShip(null);

    const geo = await fetch("/api/shipping/geo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zip }),
    });

    const geoData = await geo.json();
    if (!geoData.success) {
      alert("Invalid ZIP code");
      return;
    }

    const result = await fetch("/api/shipping/calc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        yardLat: lot.yard.lat,
        yardLon: lot.yard.lon,
        customerLat: geoData.lat,
        customerLon: geoData.lon,
        rate: 2.25,
      }),
    });

    const data = await result.json();
    if (!data.success) return;

    setShip(data);
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading)
    return <p className="text-center py-20 text-gray-600 text-lg">Loading lot...</p>;

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* TOP BAR */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {lot.year} {lot.make} {lot.model}
        </h1>
        <p className="text-gray-600 mt-1 text-sm">Lot #{lotId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        {/* LEFT — IMAGES */}
        <div className="md:col-span-7">
          <div className="w-full h-[420px] rounded-xl overflow-hidden shadow-md border relative">
            <Image
              src={mainImg}
              alt="Vehicle"
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-5 gap-3 mt-4">
            {lot.images.map((img: string, i: number) => (
              <div
                key={i}
                onClick={() => setMainImg(img)}
                className={`border rounded-lg overflow-hidden cursor-pointer ${
                  mainImg === img ? "ring-2 ring-blue-600" : ""
                }`}
              >
                <img src={img} className="w-full h-20 object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — LIVE AUCTION PANEL */}
        <div className="md:col-span-5 bg-white shadow-lg rounded-xl p-6 border">

          {/* CURRENT BID */}
          <p
            className={`text-4xl font-extrabold mb-3 transition-all duration-300 ${
              flash ? "text-green-600 scale-110" : "text-blue-700 scale-100"
            }`}
          >
            ${lot.currentBid.toLocaleString()}
          </p>

          <p className="text-gray-600 text-sm mb-1">
            Bid Increment: <strong>+${lot.bidIncrement}</strong>
          </p>

          <p className="text-gray-600 text-sm">
            Time Left: <span className="font-bold text-red-600">{timeLeft}</span>
          </p>

          <p className="text-gray-600 text-sm mb-5">
            Status: <strong>{lot.saleStatus}</strong>
          </p>

          {/* REQUEST BID */}
          <a
            href={`/request-buy/${lotId}`}
            className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold text-lg"
          >
            Request a Bid
          </a>

          {lot.buyItNow && (
            <div className="mt-6 p-5 rounded-xl bg-green-50 border border-green-300">
              <p className="text-green-700 font-extrabold text-2xl">
                ${lot.buyItNow}
              </p>
              <p className="text-sm mb-3 text-green-700">Buy It Now Price</p>
              <a
                href={`/request-buy/${lotId}?bin=1`}
                className="block bg-green-600 text-white py-2 rounded-md text-center hover:bg-green-700"
              >
                Buy It Now Request
              </a>
            </div>
          )}
        </div>
      </div>

      {/* LOWER DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">

        {/* LEFT DETAILS */}
        <div className="md:col-span-2 space-y-6">

          {/* VEHICLE INFO */}
          <section className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold mb-4">Vehicle Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Year:</strong> {lot.year}</p>
              <p><strong>Make:</strong> {lot.make}</p>
              <p><strong>Model:</strong> {lot.model}</p>
              <p><strong>Odometer:</strong> {lot.odometer} miles</p>
              <p><strong>Keys:</strong> {lot.keys ? "Yes" : "No"}</p>
              <p><strong>Condition:</strong> {lot.condition}</p>
            </div>
          </section>

          {/* DAMAGE */}
          <section className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold mb-4">Damage Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Primary Damage:</strong> {lot.primaryDamage}</p>
              <p><strong>Secondary Damage:</strong> {lot.secondaryDamage || "None"}</p>
              <p className="col-span-2">
                <strong>Seller Notes:</strong> {lot.sellerNotes || "None"}
              </p>
            </div>
          </section>

          {/* TITLE */}
          <section className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold mb-4">Title Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>VIN:</strong> {lot.vin}</p>
              <p><strong>Title Type:</strong> {lot.titleType}</p>
              <p><strong>Title State:</strong> {lot.titleState}</p>
              <p><strong>Brand:</strong> {lot.titleBrand || "None"}</p>
            </div>
          </section>

          {/* SHIPPING ESTIMATE */}
          <section className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold mb-4">Shipping Estimate</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter your ZIP code"
                className="border rounded-lg p-3"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />

              <button
                onClick={calculateShipping}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
              >
                Calculate Shipping
              </button>

              {ship && (
                <div className="mt-4 border-t pt-4 space-y-1 text-sm">
                  <p><strong>Miles:</strong> {ship.miles}</p>
                  <p><strong>Estimated Price:</strong> ${ship.price}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT DETAILS */}
        <div className="space-y-6">

          {/* SELLER */}
          <section className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold mb-4">Seller Information</h2>
            <p><strong>Name:</strong> {lot.sellerName}</p>
            <p><strong>Type:</strong> {lot.sellerType}</p>
            <p><strong>Phone:</strong> {lot.sellerPhone || "N/A"}</p>
          </section>

          {/* YARD INFO */}
          <section className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold mb-4">Yard Location</h2>
            <p><strong>Yard:</strong> {lot.yard.name}</p>
            <p><strong>Address:</strong> {lot.yard.address}</p>
            <p><strong>GPS:</strong> {lot.yard.lat}, {lot.yard.lon}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

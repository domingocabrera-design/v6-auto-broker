"use client";

import { useState } from "react";

type YardLocation = {
  lat: number;
  lon: number;
};

type ShippingEstimatorProps = {
  yard: YardLocation;
};

export default function ShippingEstimator({ yard }: ShippingEstimatorProps) {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [result, setResult] = useState<any>(null);

  const geocode = async () => {
    // Use OpenStreetMap (FREE)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      setCoords({
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
      });
    } else {
      alert("Address not found");
    }
  };

  const calculateShipping = async () => {
    if (!coords) {
      alert("Enter your location first");
      return;
    }

    const res = await fetch("/api/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        yardLat: yard.lat,
        yardLon: yard.lon,
        destLat: coords.lat,
        destLon: coords.lon,
      }),
    });

    const data = await res.json();
    if (data.success) setResult(data);
  };

  return (
    <div>
      {/* ADDRESS INPUT */}
      <label className="font-semibold text-sm">Your City or Address</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full mb-3 mt-1 p-2 border rounded"
        placeholder="Miami, FL"
      />

      <button
        onClick={geocode}
        className="w-full bg-gray-700 text-white py-2 rounded font-semibold hover:bg-gray-800"
      >
        Set Destination
      </button>

      {coords && (
        <p className="mt-2 text-sm text-green-700">
          📍 Location set! Now get shipping cost.
        </p>
      )}

      {/* CALCULATE SHIPPING */}
      <button
        onClick={calculateShipping}
        className="w-full bg-black text-white py-2 rounded font-semibold mt-3 hover:bg-gray-900"
      >
        Calculate Shipping
      </button>

      {/* RESULT */}
      {result && (
        <div className="mt-4 p-4 bg-gray-50 border rounded-xl text-sm space-y-2">
          <p><strong>Distance:</strong> {result.distance} miles</p>
          <p><strong>Rate:</strong> ${result.rate}/mile</p>

          <p className="text-lg font-bold text-blue-700">
            Estimated Cost: ${result.estimate.toLocaleString()}
          </p>

          <p className="text-xs text-gray-600">
            *Actual rates vary by driver availability, vehicle type, and season.*
          </p>
        </div>
      )}
    </div>
  );
}

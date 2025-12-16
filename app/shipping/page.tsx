"use client";

import { useState } from "react";
import Image from "next/image";

export default function ShippingPage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [vehicle, setVehicle] = useState("sedan");
  const [running, setRunning] = useState("running");
  const [result, setResult] = useState<any>(null);

  function calculateEstimate() {
    if (!pickup || !dropoff) return;

    // Fake miles for now until API is hooked
    const miles = Math.floor(Math.random() * 800 + 200); // 200–1000 miles

    // Rate logic (simple)
    const ratePerMile = vehicle === "truck" ? 1.2 : vehicle === "suv" ? 1.0 : 0.85;
    const runningFee = running === "not-running" ? 75 : 0;
    const baseCost = miles * ratePerMile + runningFee;

    setResult({
      miles,
      baseCost,
      total: baseCost.toFixed(2),
    });
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        
        {/* PAGE TITLE */}
        <h1 className="text-4xl font-extrabold text-center mb-10">
          Vehicle Shipping Estimate
        </h1>

        {/* FORM CARD */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-gray-700">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PICKUP */}
            <div>
              <label className="block mb-2 font-semibold">Pickup ZIP / Location</label>
              <input
                type="text"
                placeholder="e.g., 90001"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0f0f0f] border border-gray-600 text-white"
              />
            </div>

            {/* DROPOFF */}
            <div>
              <label className="block mb-2 font-semibold">Destination ZIP / Country</label>
              <input
                type="text"
                placeholder="e.g., 08302 or Dominican Republic"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0f0f0f] border border-gray-600 text-white"
              />
            </div>

            {/* VEHICLE TYPE */}
            <div>
              <label className="block mb-2 font-semibold">Vehicle Type</label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0f0f0f] border border-gray-600 text-white"
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
              </select>
            </div>

            {/* RUNNING OR NOT */}
            <div>
              <label className="block mb-2 font-semibold">Condition</label>
              <select
                value={running}
                onChange={(e) => setRunning(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0f0f0f] border border-gray-600 text-white"
              >
                <option value="running">Running</option>
                <option value="not-running">Non-running</option>
              </select>
            </div>

          </div>

          {/* CALCULATE BUTTON */}
          <button
            onClick={calculateEstimate}
            className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white"
          >
            Get Instant Estimate
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <div className="bg-black border border-gray-700 mt-10 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Estimated Shipping Cost</h2>

            <p className="text-gray-300 mb-2">Distance: <b>{result.miles} miles</b></p>
            <p className="text-gray-300 mb-2">Base Cost: <b>${result.baseCost.toFixed(2)}</b></p>

            <h3 className="text-3xl font-extrabold mt-4 text-green-400">
              Total: ${result.total}
            </h3>

            <button className="mt-6 w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200">
              Request Full Shipping Service
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

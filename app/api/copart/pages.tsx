"use client";

import { useState } from "react";

export default function CopartPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lot, setLot] = useState<any>(null);

  const handleLookup = async () => {
    setError("");
    setLot(null);

    if (!url.includes("copart.com")) {
      setError("Please enter a valid Copart URL.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/copart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Unable to fetch Copart details.");
      } else {
        setLot(json.data);
      }
    } catch (err) {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Copart Lookup</h1>

      <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
        <label className="text-gray-300 font-medium">Enter Copart Lot URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.copart.com/lot/58046565"
          className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-800 text-white outline-none border border-gray-600 focus:border-blue-400"
        />

        <button
          onClick={handleLookup}
          className="mt-4 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {loading ? "Fetching…" : "Lookup Lot"}
        </button>

        {error && (
          <p className="mt-4 text-red-400 font-semibold">{error}</p>
        )}
      </div>

      {lot && (
        <div className="mt-8 bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-700 text-gray-200">
          <h2 className="text-2xl font-bold mb-4">Lot Details</h2>

          <div className="space-y-2">
            <p><span className="font-semibold">Lot ID:</span> {lot.lot_id}</p>
            <p><span className="font-semibold">Year:</span> {lot.year}</p>
            <p><span className="font-semibold">Make:</span> {lot.make}</p>
            <p><span className="font-semibold">Model:</span> {lot.model}</p>
            <p><span className="font-semibold">Odometer:</span> {lot.odometer}</p>
          </div>

          <div className="mt-4">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View on Copart →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

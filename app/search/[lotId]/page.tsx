"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Filters from "@/components/ui/Filters";
import LotCard from "@/components/ui/LotCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`/api/copart/search?q=${query}`);
      const data = await res.json();
      setResults(data?.lots || []);
    } catch (err) {
      console.log("Search failed:", err);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* TOP V6 DASHBOARD HEADER */}
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-10">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-6">Search Vehicle Lots</h1>

        {/* SEARCH BAR */}
        <div className="flex gap-3 mb-8 bg-black border border-gray-700 rounded-xl p-3 shadow-lg">
          <input
            type="text"
            placeholder="Search by Lot ID, VIN, Make, or Model..."
            className="flex-1 bg-black text-white text-lg outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
          >
            Search
          </button>
        </div>

        {/* FILTERS */}
        <Filters />

        {/* RESULTS */}
        {loading && (
          <p className="text-gray-400 text-xl mt-6">Searching lots…</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {results.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>

        {!loading && results.length === 0 && (
          <p className="text-gray-500 text-center mt-10 text-lg">
            No results yet. Try searching for a vehicle.
          </p>
        )}
      </div>
    </div>
  );
}

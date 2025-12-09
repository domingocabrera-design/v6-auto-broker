"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    const res = await fetch("/api/analytics/summary");
    const data = await res.json();
    setSummary(data);
  }

  if (!summary) return <p className="ml-64 p-10 text-white">Loading analytics…</p>;

  return (
    <div className="p-10 ml-64 text-white">
      <h1 className="text-3xl font-bold mb-6">Platform Analytics</h1>

      <div className="grid grid-cols-3 gap-6">
        <AnalyticsCard title="Total Users" value={summary.users} />
        <AnalyticsCard title="Total Bids" value={summary.bids} />
        <AnalyticsCard title="Revenue" value={`$${summary.revenue}`} />
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value }: any) {
  return (
    <div className="bg-[#1d1d1d] p-8 rounded-xl text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

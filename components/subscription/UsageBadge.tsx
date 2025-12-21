"use client";

import { useEffect, useState } from "react";

type Usage = {
  used: number;
  limit: number;
};

export default function UsageBadge({ lang }: { lang: "en" | "es" }) {
  const [usage, setUsage] = useState<Usage | null>(null);

  async function loadUsage() {
    const res = await fetch("/api/user/can-bid");
    const data = await res.json();

    if (
      typeof data.used === "number" &&
      typeof data.limit === "number"
    ) {
      setUsage({ used: data.used, limit: data.limit });
    }
  }

  useEffect(() => {
    loadUsage();

    const handler = () => loadUsage();
    window.addEventListener("subscription-updated", handler);

    return () => {
      window.removeEventListener("subscription-updated", handler);
    };
  }, []);

  if (!usage) return null;

  const percent = Math.round((usage.used / usage.limit) * 100);

  return (
    <div className="flex flex-col gap-1 px-3 py-2 rounded-lg border border-gray-700 bg-[#0f0f0f] text-xs min-w-[140px]">
      <span className="font-semibold text-white">
        {lang === "en" ? "Plan Usage" : "Uso del Plan"}
      </span>

      <span className="text-gray-400">
        {usage.used} / {usage.limit}{" "}
        {lang === "en" ? "slots used" : "cupos usados"}
      </span>

      <div className="w-full h-2 bg-gray-800 rounded">
        <div
          className={`h-2 rounded ${
            percent < 70
              ? "bg-blue-500"
              : percent < 100
              ? "bg-yellow-500"
              : "bg-red-600"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {usage.used >= usage.limit && (
        <a
          href={`/${lang}/pricing`}
          className="mt-1 text-center text-xs font-bold text-blue-400 hover:underline"
        >
          {lang === "en" ? "Upgrade plan" : "Mejorar plan"}
        </a>
      )}
    </div>
  );
}

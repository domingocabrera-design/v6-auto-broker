"use client";

import { useEffect, useState } from "react";

function getTimeLeft(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { hours, minutes };
}

export default function Countdown({ saleDate }: { saleDate: string }) {
  const [time, setTime] = useState(() => getTimeLeft(saleDate));

  useEffect(() => {
    const i = setInterval(() => {
      setTime(getTimeLeft(saleDate));
    }, 60000);
    return () => clearInterval(i);
  }, [saleDate]);

  if (!time) return null;

  const urgent = time.hours <= 12;

  return (
    <div
      className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold
        ${urgent ? "bg-red-600 text-white animate-pulse" : "bg-orange-500 text-white"}
      `}
    >
      ⏳ {time.hours}h {time.minutes}m left
    </div>
  );
}

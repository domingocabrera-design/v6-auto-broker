"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function FeaturedCarousel() {
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/copart/get-featured")
      .then(r => r.json())
      .then(d => setCars(d?.cars?.slice(0, 8) || []));
  }, []);

  if (!cars.length) return null;

  return (
    <section className="py-12 border-b border-gray-800">
      <h2 className="text-3xl font-bold text-center mb-6">
        Featured Copart Vehicles
      </h2>

      <div className="flex gap-6 overflow-x-auto px-6 snap-x snap-mandatory">
        {cars.map((car, i) => (
          <div
            key={i}
            className="min-w-[300px] bg-[#0f0f0f] border border-gray-700 rounded-xl p-4 snap-start"
          >
            <Image
              src={car.image}
              alt="car"
              width={300}
              height={180}
              className="rounded-lg object-cover h-40"
            />
            <h3 className="mt-3 font-bold">
              {car.year} {car.make} {car.model}
            </h3>
            <p className="text-gray-400 text-sm">Lot #{car.lotId}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

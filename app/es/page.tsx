"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomeEsPage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  const targetTime = new Date();
  targetTime.setHours(17, 0, 0, 0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/copart/get-featured");
        const data = await res.json();
        setFeatured(data?.cars || []);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const int = setInterval(() => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("¡Subasta en vivo!");
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="py-24 text-center border-b border-gray-800">
        <Image src="/v6-logo.png" width={160} height={160} alt="V6" className="mx-auto mb-6" />
        <h1 className="text-5xl font-extrabold">
          Compra en Copart <span className="text-blue-500">Sin Licencia de Dealer</span>
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
          Acceso legal a subastas exclusivas para dealers con V6 Auto Broker.
        </p>
        <a
          href="/es/pricing"
          className="inline-block mt-10 px-12 py-5 bg-blue-600 rounded-2xl text-2xl font-bold"
        >
          SUSCRÍBETE HOY
        </a>
      </section>

      {/* SEARCH */}
      <section className="py-14 border-b border-gray-800 text-center">
        <input
          placeholder="Buscar vehículos…"
          className="w-full max-w-xl px-5 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
      </section>

      {/* VEHICLES */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        {loading ? (
          <p className="text-center text-gray-500">Cargando vehículos…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {featured
              .filter((c: any) =>
                `${c.make} ${c.model} ${c.year}`.toLowerCase().includes(search)
              )
              .map((car: any, i: number) => (
                <div key={i} className="bg-[#0f0f0f] p-4 rounded-xl border border-gray-700">
                  <Image src={car.image} alt="" width={400} height={260} className="rounded" />
                  <h3 className="mt-3 font-bold">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-gray-400 text-sm">Lote #{car.lotId}</p>
                  <a
                    href={`/es/lot/${car.lotId}`}
                    className="block mt-4 py-2 bg-blue-600 text-center rounded-lg font-bold"
                  >
                    OFERTAR
                  </a>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* COUNTDOWN */}
      <section className="bg-blue-600 py-4 text-center font-bold">
        Próxima subasta Copart en: {timeLeft}
      </section>

    </div>
  );
}

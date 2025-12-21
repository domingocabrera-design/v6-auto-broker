"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDict, Lang } from "@/lib/i18n";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import StickySubscribeCTA from "@/components/StickySubscribeCTA";
import { track } from "@/lib/analytics";

export default function HomePage({ lang }: { lang: Lang }) {
  const t = getDict(lang).home;

  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  /* ================= AUCTION COUNTDOWN ================= */
  const targetTime = new Date();
  targetTime.setHours(17, 0, 0, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = targetTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(t.live);
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [t.live]);

  /* ================= LOAD FEATURED LOTS ================= */
  useEffect(() => {
    fetch("/api/copart/get-featured")
      .then((r) => r.json())
      .then((d) => setFeatured(d?.cars || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ================= HERO ================= */}
      <section className="relative px-6 py-24 text-center border-b border-gray-800">
        <div className="max-w-5xl mx-auto">

          <Image
            src="/v6-logo.png"
            width={180}
            height={180}
            alt="V6 Auto Broker"
            className="mx-auto mb-6 drop-shadow-[0_0_22px_rgba(0,122,255,0.7)]"
            priority
          />

          <h1 className="text-4xl md:text-5xl font-extrabold">
            {t.title}
          </h1>

          <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <a
            href={`/${lang}/pricing`}
            onClick={() => track("homepage_primary_cta")}
            className="
              inline-block mt-10 px-14 py-5
              bg-gradient-to-r from-blue-600 to-blue-500
              text-white text-2xl font-extrabold
              rounded-2xl
              shadow-[0_6px_0_0_rgba(0,60,130,1)]
              hover:scale-[1.04] transition
            "
          >
            {t.cta}
          </a>

          {/* FLAGS */}
          <div className="flex justify-center gap-3 mt-8 opacity-80">
            {["usa","mx","gt","hn","do","ng","af"].map((f) => (
              <Image
                key={f}
                src={`/${f}.png`}
                alt={f}
                width={38}
                height={26}
                className="rounded"
              />
            ))}
          </div>

        </div>
      </section>

      {/* ================= FEATURED CAROUSEL ================= */}
      <FeaturedCarousel />

      {/* ================= SEARCH ================= */}
      <section className="py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-6">
            {lang === "en" ? "Search Vehicles" : "Buscar Vehículos"}
          </h2>

          <input
            type="text"
            placeholder={t.search}
            className="
              w-full max-w-2xl mx-auto block
              px-6 py-4 rounded-xl
              bg-[#0d0d0d] border border-gray-700
              text-white
            "
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
      </section>

      {/* ================= VEHICLE GRID ================= */}
      <section className="py-16">
        {loading ? (
          <p className="text-center text-gray-500">
            {lang === "en" ? "Loading vehicles..." : "Cargando vehículos..."}
          </p>
        ) : (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featured
              .filter((c) =>
                `${c.make} ${c.model} ${c.year}`
                  .toLowerCase()
                  .includes(search)
              )
              .map((car, i) => (
                <VehicleCard key={i} car={car} lang={lang} />
              ))}
          </div>
        )}
      </section>

      {/* ================= COUNTDOWN ================= */}
      <section className="bg-blue-600 py-6 text-center text-xl font-bold">
        {t.next} <span className="font-extrabold">{timeLeft}</span>
      </section>

      {/* ================= WHAT IS V6 ================= */}
      <section className="py-20 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {lang === "en" ? "What Is V6 Auto Broker?" : "¿Qué es V6 Auto Broker?"}
          </h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            {lang === "en"
              ? "V6 Auto Broker gives everyday buyers legal access to Copart’s dealer-only auctions."
              : "V6 Auto Broker brinda acceso legal a subastas exclusivas para dealers en Copart."}
          </p>
        </div>
      </section>

      {/* ================= PRICING CTA ================= */}
      <section className="py-20 text-center">
        <a
          href={`/${lang}/pricing`}
          onClick={() => track("homepage_secondary_cta")}
          className="inline-block px-12 py-4 bg-blue-600 rounded-xl text-black font-bold text-xl hover:bg-blue-500 transition"
        >
          {lang === "en" ? "View Pricing Plans" : "Ver Planes de Precio"}
        </a>
      </section>

      {/* ================= STICKY CTA ================= */}
      <StickySubscribeCTA lang={lang} />
    </div>
  );
}

/* ================= VEHICLE CARD ================= */
function VehicleCard({ car, lang }: any) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-700 rounded-xl p-4 hover:scale-[1.03] transition">
      <Image
        src={car.image}
        alt="Car"
        width={400}
        height={260}
        className="rounded-lg h-48 object-cover"
      />

      <h3 className="mt-3 font-bold text-lg">
        {car.year} {car.make} {car.model}
      </h3>

      <p className="text-gray-400 text-sm">Lot #{car.lotId}</p>

      <a
        href={`/${lang}/lot/${car.lotId}`}
        onClick={() => track("homepage_bid_click", { lotId: car.lotId })}
        className="block mt-4 py-3 bg-blue-600 text-center font-bold rounded-xl hover:bg-blue-500 transition"
      >
        {lang === "en" ? "BID NOW" : "OFERTAR"}
      </a>
    </div>
  );
}

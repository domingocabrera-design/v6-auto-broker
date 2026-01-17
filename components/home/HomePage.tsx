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

  /* ───────── COUNTDOWN ───────── */
  useEffect(() => {
    const target = new Date();
    target.setHours(17, 0, 0, 0);

    const timer = setInterval(() => {
      const diff = target.getTime() - Date.now();
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

  /* ───────── FEATURED LOTS ───────── */
  useEffect(() => {
    fetch("/api/copart/get-featured")
      .then((r) => r.json())
      .then((d) => setFeatured(d?.cars || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ───────── HERO ───────── */}
      <section className="relative py-24 border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-black to-black" />

        <Image
          src="/cars/land-cruiser.png"
          alt="Land Cruiser"
          width={1100}
          height={600}
          priority
          className="absolute right-[-160px] bottom-[-60px] opacity-90 pointer-events-none"
        />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <Image
            src="/v6-logo.png"
            alt="V6 Auto Broker"
            width={160}
            height={160}
            className="mx-auto mb-6"
            priority
          />

          <h1 className="text-4xl md:text-6xl font-extrabold">
            {t.title}
          </h1>

          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            {t.subtitle}
          </p>

          <a
            href={`/${lang}/pricing`}
            onClick={() => track("homepage_primary_cta")}
            className="inline-block mt-10 px-14 py-5 bg-blue-600 rounded-2xl text-xl font-extrabold hover:bg-blue-500 transition"
          >
            {t.cta}
          </a>

          {/* FLAGS */}
          <div className="flex justify-center gap-3 mt-10 opacity-80">
            {["usa", "mx", "gt", "hn", "do", "ng", "af"].map((f) => (
              <Image
                key={f}
                src={`/${f}.png`}
                alt={f}
                width={36}
                height={24}
                className="rounded"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FEATURED CAROUSEL ───────── */}
      <FeaturedCarousel />

      {/* ───────── SEARCH ───────── */}
      <section className="py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <input
            placeholder={t.search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className="w-full max-w-2xl mx-auto block px-6 py-4 rounded-xl bg-[#0d0d0d] border border-gray-700"
          />
        </div>
      </section>

      {/* ───────── GRID ───────── */}
      <section className="py-16">
        {loading ? (
          <p className="text-center text-gray-500">Loading…</p>
        ) : (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featured
              .filter((c) =>
                `${c.make} ${c.model} ${c.year}`
                  .toLowerCase()
                  .includes(search)
              )
              .map((car, i) => (
                <div
                  key={i}
                  className="bg-[#0f0f0f] border border-gray-700 rounded-xl p-4"
                >
                  <Image
                    src={car.image}
                    alt="Car"
                    width={400}
                    height={260}
                    className="rounded-lg h-48 object-cover"
                  />

                  <h3 className="mt-3 font-bold">
                    {car.year} {car.make} {car.model}
                  </h3>

                  <a
                    href={`/${lang}/lot/${car.lotId}`}
                    className="block mt-4 py-3 bg-blue-600 text-center rounded-xl font-bold hover:bg-blue-500"
                  >
                    BID NOW
                  </a>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* ───────── COUNTDOWN ───────── */}
      <section className="bg-blue-600 py-6 text-center font-bold">
        {t.next} <span className="font-extrabold">{timeLeft}</span>
      </section>

      <StickySubscribeCTA lang={lang} />
    </div>
  );
}

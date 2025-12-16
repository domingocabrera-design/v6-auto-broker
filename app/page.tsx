"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const targetTime = new Date();
  targetTime.setHours(17, 0, 0, 0);
  const [timeLeft, setTimeLeft] = useState("");

  /* ---------------- LOAD FEATURED LOTS ---------------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/copart/get-featured");
        const data = await res.json();
        setFeatured(data?.cars || []);
      } catch (err) {
        console.log("Featured error:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  /* ---------------- COUNTDOWN ---------------- */
  useEffect(() => {
    const int = setInterval(() => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Auction Live Now!");
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

      {/* ================= NAVBAR ================= */}
      <header className="w-full bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <Image
              src="/v6-logo.png"
              width={55}
              height={55}
              alt="V6 Logo"
              className="drop-shadow-[0_0_10px_rgba(0,122,255,0.8)]"
            />
            <h1 className="text-white text-2xl font-extrabold tracking-wide">
              V6 Auto Broker
            </h1>
          </div>

          {/* NAV LINKS */}
          <nav className="flex items-center gap-8 text-white text-sm font-semibold">
            <a href="/" className="hover:text-blue-400 transition">Home</a>
            <a href="/pricing" className="hover:text-blue-400 transition">Pricing</a>
            <a href="/faq" className="hover:text-blue-400 transition">FAQ</a>
            <a href="/contact" className="hover:text-blue-400 transition">Contact Us</a>

            <a
              href="/login"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition shadow-lg text-black font-bold"
            >
              Login
            </a>
          </nav>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative bg-black text-white px-6 py-20 md:py-28 overflow-hidden border-b border-gray-800">
        <div className="relative z-10 max-w-5xl mx-auto text-center">

          <div className="relative w-fit mx-auto mb-4">
            <Image
              src="/v6-logo.png"
              alt="V6 Auto Broker Logo"
              width={180}
              height={180}
              className="
                drop-shadow-[0_0_22px_rgba(0,122,255,0.7)]
                hover:drop-shadow-[0_0_40px_rgba(0,122,255,1)]
                transition
              "
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold">
            Buy From Copart{" "}
            <span className="text-blue-500">Without a Dealer License</span>
          </h1>

          <p className="mt-3 text-gray-300 text-lg max-w-2xl mx-auto">
            Full access to Copart dealer-only auctions through V6 Auto Broker.
          </p>

          {/* LAND CRUISER */}
          <div className="relative flex justify-center mt-10">
            <div className="absolute w-[600px] h-[250px] bg-blue-500/10 blur-[90px] rounded-full"></div>
            <Image
              src="/cars/land-cruiser.png"
              alt="Land Cruiser"
              width={780}
              height={420}
              className="relative object-contain drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
            />
          </div>

          <div className="w-[400px] h-[40px] bg-black/60 blur-[28px] rounded-full mx-auto -mt-7"></div>

          <button
            className="
              mt-10 px-14 py-5
              bg-gradient-to-r from-blue-600 to-blue-500
              text-white text-2xl font-extrabold tracking-wide
              rounded-2xl
              shadow-[0_6px_0_0_rgba(0,60,130,1)]
              active:translate-y-1 hover:scale-[1.04]
              transition-all duration-150
            "
          >
            SUBSCRIBE TODAY
          </button>

          {/* FLAGS */}
          <div className="flex items-center gap-3 mt-8 justify-center opacity-80">
            <Flag code="usa" />
            <Flag code="mx" />
            <Flag code="gt" />
            <Flag code="hn" />
            <Flag code="do" />
            <Flag code="ng" />
            <Flag code="af" />
          </div>

        </div>
      </section>

      {/* ================= SEARCH ================= */}
      <section className="bg-black py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-6 text-white">
            Search Vehicles
          </h2>

          <div className="flex justify-center mb-10">
            <input
              type="text"
              placeholder="Search vehicles..."
              className="
                w-full max-w-2xl px-6 py-4 rounded-xl
                bg-[#0d0d0d] border border-gray-700 text-white
                shadow-lg
                focus:border-blue-500 focus:ring-2 focus:ring-blue-600
                transition
              "
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
          </div>

          {/* FILTERED GRID */}
          {loading ? (
            <p className="text-center text-gray-500">Loading vehicles...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featured
                .filter((car: any) =>
                  `${car.make} ${car.model} ${car.year}`
                    .toLowerCase()
                    .includes(search)
                )
                .map((car: any, i: number) => (
                  <VehicleCard key={i} car={car} />
                ))}
            </div>
          )}

        </div>
      </section>

      {/* ================= FEATURED COPART LOTS ================= */}
      <section className="bg-black py-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10 text-blue-500">
            Featured Copart Lots
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading featured lots...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featured.slice(0, 8).map((car: any, i: number) => (
                <CopartCard key={i} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= COUNTDOWN ================= */}
      <section className="bg-blue-600 text-white py-6 text-center text-xl font-bold border-b border-gray-900">
        Next Copart Auction Starts In: <span className="font-extrabold">{timeLeft}</span>
      </section>

      {/* ================= WHAT IS V6 ================= */}
      <section className="py-20 bg-black border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-6">What Is V6 Auto Broker?</h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            V6 Auto Broker gives everyday buyers legal access to Copart’s dealer-only auctions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
            <InfoBox title="Dealer-Level Access" text="Bid on thousands of Copart lots instantly." />
            <InfoBox title="No License Required" text="We broker every purchase legally and safely." />
            <InfoBox title="Transparent Pricing" text="Simple pricing + full support + no surprises." />
          </div>

        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section className="py-20 bg-black">
        <PremiumPricing />
      </section>

    </div>
  );
}

/* ================= FLAG ================= */
function Flag({ code }: any) {
  return <Image src={`/${code}.png`} alt={code} width={38} height={26} className="rounded" />;
}

/* ================= VEHICLE CARD ================= */
function VehicleCard({ car }: any) {
  async function handleBid() {
    const res = await fetch("/api/user/check-subscription");
    const data = await res.json();

    if (!data.subscribed) {
      window.location.href = "/pricing";
      return;
    }

    window.location.href = `/lot/${car.lotId}`;
  }

  return (
    <div className="bg-[#0f0f0f] border border-gray-700 rounded-xl shadow hover:shadow-blue-900/40 hover:scale-[1.03] transition p-4">
      <Image
        src={car.image}
        alt="Car"
        width={400}
        height={260}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h3 className="font-bold mt-3 text-lg text-white">
        {car.year} {car.make} {car.model}
      </h3>

      <p className="text-gray-400 text-sm">Lot #{car.lotId}</p>
      <p className="text-gray-400 text-sm">Location: {car.location}</p>
      <p className="text-gray-400 text-sm">Odometer: {car.odometer}</p>

      <button
        onClick={handleBid}
        className="
          mt-4 w-full py-3
          bg-blue-600 text-white font-bold
          rounded-xl
          hover:bg-blue-500
          transition
        "
      >
        BID NOW
      </button>
    </div>
  );
}

/* ================= COPART CARD ================= */
function CopartCard({ car }: any) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-700 rounded-xl shadow p-4 hover:shadow-blue-900/40 hover:scale-[1.03] transition">
      <Image
        src={car.image}
        alt="Car"
        width={400}
        height={260}
        className="w-full h-44 object-cover rounded-md"
      />

      <h3 className="font-bold mt-3 text-lg text-white">
        {car.year} {car.make} {car.model}
      </h3>

      <p className="text-gray-400 text-sm">Lot #{car.lotId}</p>
      <p className="text-gray-400 text-sm">Location: {car.location}</p>
      <p className="text-gray-400 text-sm">Odometer: {car.odometer}</p>

      <button className="mt-4 w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition">
        BID NOW
      </button>
    </div>
  );
}

/* ================= INFO BOX ================= */
function InfoBox({ title, text }: any) {
  return (
    <div className="p-6 bg-[#0f0f0f] rounded-xl border border-gray-700 shadow text-center">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-400 mt-2">{text}</p>
    </div>
  );
}

/* ================= PRICING ================= */
function PremiumPricing() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-4">V6 Auto Broker Plans</h2>
      <p className="text-center text-gray-400 mb-14 text-lg">
        Every plan includes a <span className="text-blue-400 font-bold">7-Day Free Trial</span>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <PlanCard title="Single Car Access" price="249" color="blue"
          features={["Buy 1 car","Basic support","Damage review","Transparent fees","Guided bidding"]} />

        <PlanCard title="3-Car Pro Access" price="599" color="green" highlight
          features={["Buy 3 cars monthly","Priority support","Fast approval","Discounted fees","Market guidance"]} />

        <PlanCard title="5-Car Elite Access" price="899" color="yellow"
          features={["Buy 5 cars monthly","VIP support","Early access","Paperwork help","Transport help"]} />

        <PlanCard title="10-Car Dealer Plan" price="1299" color="red"
          features={["Buy 10 cars","Top tier support","Personal advisor","Priority access","Advanced tools"]} />
      </div>
    </div>
  );
}

/* ================= PLAN CARD WITH DIAGONAL RIBBON ================= */
function PlanCard({ title, price, features, color, highlight }: any) {
  const borderColor = {
    blue: "border-blue-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    red: "border-red-500",
  }[color];

  return (
    <div
      className={`
        relative
        p-8 rounded-2xl shadow-xl bg-[#0f0f0f] text-white border ${borderColor}
        transition hover:scale-105 hover:shadow-blue-900/40
        ${highlight ? "scale-105 shadow-blue-900/40" : ""}
      `}
    >

      {/* ✦ DIAGONAL RIBBON ✦ */}
      <div
        className="
          absolute top-4 -right-14 
          bg-blue-600 text-white font-bold text-sm
          py-2 px-16 
          rotate-45
          shadow-lg
        "
      >
        7-DAY FREE TRIAL
      </div>

      <h3 className={`text-2xl font-bold mb-3 text-${color}-400`}>
        {title}
      </h3>

      <p className="text-5xl font-extrabold">${price}</p>

      <p className="text-gray-400 text-sm mt-1 mb-6">
        One-Time Plan
      </p>

      <ul className="space-y-2 text-gray-300 text-sm">
        {features.map((f: string, i: number) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>

      <button
        className="
          w-full mt-6 py-3 rounded-xl 
          bg-blue-600 text-black font-semibold 
          hover:bg-blue-500 transition
        "
      >
        Select Plan
      </button>
    </div>
  );
}

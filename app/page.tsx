"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const targetTime = new Date();
  targetTime.setHours(17, 0, 0, 0); // 5PM daily
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

  /* ---------------- COUNTDOWN TIMER ---------------- */
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
    <div className="min-h-screen bg-gray-50">

      {/* GOLD V6 BOT TOP RIGHT */}
      <div className="fixed top-6 right-6 opacity-90 hover:opacity-100 transition">
        <Image
          src="/goldv6.png"
          alt="Gold V6 Bot"
          width={90}
          height={90}
          className="drop-shadow-[0_0_18px_rgba(255,215,0,0.45)]"
        />
      </div>

      {/* ================= HERO ================= */}
      <section className="relative bg-[#0f0f0f] text-white px-6 py-24 md:py-32 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">

          {/* LEFT SIDE */}
          <div className="md:w-1/2 text-center md:text-left">
            <Image 
              src="/v6-logo.png"
              alt="V6 Auto Broker Logo"
              width={220}
              height={220}
              className="mx-auto md:mx-0 mb-6"
            />

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Buy From Copart  
              <span className="text-blue-400"> Without a Dealer License</span>
            </h1>

            <p className="mt-4 text-gray-300 text-lg">
              V6 Auto Broker connects you directly to Copart dealer-only auctions with transparent pricing and real support.
            </p>

            <button className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition">
              Request a Car
            </button>

            {/* FLAGS */}
            <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
              <Flag code="usa" />
              <Flag code="mx" />
              <Flag code="pr" />
              <Flag code="do" />
              <Flag code="hn" />
              <Flag code="sv" />
            </div>
          </div>

          {/* RIGHT SIDE — (NOW GOLD V6 IS FLOATING TOP RIGHT ONLY) */}
          <div className="md:w-1/2 flex justify-center relative"></div>

          {/* LANGUAGE SWITCH */}
          <div className="absolute top-6 right-6 flex gap-3">
            <button className="px-4 py-2 border border-gray-400 rounded-xl text-sm hover:bg-gray-800">
              EN
            </button>
            <button className="px-4 py-2 border border-gray-400 rounded-xl text-sm hover:bg-gray-800">
              ES
            </button>
          </div>
        </div>
      </section>

      {/* ================= COUNTDOWN ================= */}
      <section className="bg-blue-600 text-white py-6 text-center text-xl font-bold shadow">
        Next Copart Auction Starts In: <span className="font-extrabold">{timeLeft}</span>
      </section>

      {/* ================= WHAT IS V6 AUTO BROKER ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">What Is V6 Auto Broker?</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            V6 Auto Broker gives regular buyers legal access to Copart’s dealer-only auctions —  
            insurance vehicles, rebuildable cars, clean title units, and premium inventory.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
            <InfoBox title="Dealer-Level Access" text="Bid on thousands of Copart lots instantly." />
            <InfoBox title="No License Required" text="We broker the vehicle for you — legally & safely." />
            <InfoBox title="Transparent Pricing" text="No surprises. Simple fees. Full support." />
          </div>
        </div>
      </section>

      {/* ================= PREMIUM PRICING (BLACK V6 THEME) ================= */}
      <section className="py-20 bg-gray-100">
        <PremiumPricing />
      </section>

      {/* ================= COPART PREVIEW (12 Cars) ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Hot Copart Deals Today
          </h2>

          {loading ? (
            <p className="text-gray-500 text-center">Loading cars...</p>
          ) : featured.length === 0 ? (
            <p className="text-center text-gray-500">No featured cars available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featured.slice(0, 12).map((car: any, i: number) => (
                <CarCard key={i} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY V6 ================= */}
      <section className="py-20 bg-gray-100">
        <WhyV6 />
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 bg-white">
        <Testimonials />
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-2">Start Bidding Today</h2>
        <p className="opacity-90 mb-6">Your bridge to Copart’s dealer-only inventory.</p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-200">
          Create Account
        </button>
      </section>
    </div>
  );
}

/* ================= FLAG COMPONENT ================= */
function Flag({ code }: any) {
  return <Image src={`/${code}.png`} alt={code} width={38} height={26} />;
}

/* ================= INFO BOX ================= */
function InfoBox({ title, text }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow border text-center">
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-gray-600 mt-2">{text}</p>
    </div>
  );
}

/* ================= CAR CARD ================= */
function CarCard({ car }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <Image
        src={car.image}
        alt="Car"
        width={400}
        height={260}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h3 className="font-bold mt-3">{car.year} {car.make} {car.model}</h3>
      <p className="text-gray-500 text-sm">Odometer: {car.odometer}</p>
      <p className="text-gray-500 text-sm">Location: {car.location}</p>
    </div>
  );
}

/* ================= PREMIUM PRICING ================= */
function PremiumPricing() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-4 text-black">
        V6 Auto Broker Plans
      </h2>
      <p className="text-center text-gray-600 mb-14">
        Unlock dealer-level buying power with transparent pricing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <PlanCard
          title="Single Car Access"
          price="249"
          color="blue"
          features={[
            "Buy 1 car with no dealer license",
            "Basic support",
            "Damage review help",
            "Transparent broker fee",
            "Copart bidding guidance",
          ]}
        />

        <PlanCard
          title="3-Car Pro Access"
          price="599"
          color="green"
          highlight
          features={[
            "Buy up to 3 cars monthly",
            "Priority customer support",
            "Faster approval",
            "Discounted broker fees",
            "Market value guidance",
          ]}
        />

        <PlanCard
          title="5-Car Elite Access"
          price="899"
          color="yellow"
          features={[
            "Buy up to 5 cars monthly",
            "VIP support",
            "Early access to hot lots",
            "Paperwork assistance",
            "Transport help",
          ]}
        />

        <PlanCard
          title="10-Car Dealer Plan"
          price="1299"
          color="red"
          features={[
            "Buy up to 10 cars monthly",
            "Top tier support",
            "Personal advisor",
            "Dealer-level priority",
            "Advanced bidding tools",
          ]}
        />

      </div>
    </div>
  );
}

/* ================= PLAN CARD ================= */
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
        p-8 rounded-2xl shadow-xl bg-black text-white border ${borderColor}
        ${highlight ? "scale-105 shadow-2xl" : ""}
        transition hover:scale-105
      `}
    >
      <h3 className={`text-2xl font-bold mb-3 text-${color}-400`}>{title}</h3>

      <p className="text-5xl font-extrabold">${price}</p>
      <p className="text-gray-400 text-sm mb-6">one-time plan</p>

      <ul className="space-y-2 text-gray-300 text-sm">
        {features.map((f: string, i: number) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>

      <button className="w-full mt-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition">
        Select Plan
      </button>
    </div>
  );
}

/* ================= WHY V6 ================= */
function WhyV6() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Why V6 Auto Broker?</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          title="Buy Like a Dealer" 
          description="Official broker access to Copart dealer-only inventory."
        />
        <FeatureCard 
          title="7X Buying Power" 
          description="Your deposit unlocks massive buying power instantly."
        />
        <FeatureCard 
          title="We Handle Everything" 
          description="Transport, bidding, guidance — full support from A to Z."
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: any) {
  return (
    <div className="bg-white border p-6 rounded-xl shadow text-center">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}

/* ================= TESTIMONIALS ================= */
function Testimonials() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-10">What Buyers Say</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Testimonial name="Carlos R." text="V6 Auto Broker helped me buy my first Copart car easily!" />
        <Testimonial name="Luis M." text="The 7X buying power changed everything for me." />
        <Testimonial name="Ana D." text="Perfect for buyers in USA and Latin America." />
      </div>
    </div>
  );
}

function Testimonial({ name, text }: any) {
  return (
    <div className="bg-white border p-6 rounded-xl shadow text-center">
      <p className="italic text-gray-600">{text}</p>
      <p className="mt-3 font-bold">{name}</p>
    </div>
  );
}

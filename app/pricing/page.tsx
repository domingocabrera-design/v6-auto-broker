export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* ───── HEADER ───── */}
      <header className="w-full py-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <img src="/v6-logo.png" className="w-20" />

          <nav className="flex gap-8 text-gray-300 text-sm">
            <a href="/" className="hover:text-white transition">Home</a>
            <a href="/pricing" className="hover:text-white transition">Pricing</a>
            <a href="/dashboard" className="hover:text-white transition">Dashboard</a>
            <a href="/faq" className="hover:text-white transition">FAQ</a>
            <a href="/login" className="text-blue-400 font-semibold hover:text-blue-300">
              Sign In
            </a>
          </nav>
        </div>
      </header>


      {/* ───── TITLE SECTION ───── */}
      <section className="text-center mt-16 px-6">
        <h1 className="text-4xl font-extrabold">Choose Your Buying Power</h1>
        <p className="text-gray-400 text-lg mt-2">
          Buy cars from Copart like a dealer — without the dealer license.
        </p>

        <p className="mt-4 text-blue-400 text-sm italic">
          “Your deposit becomes your real buying power.”
        </p>
      </section>


      {/* ───── PRICING GRID ───── */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 px-6">

        {/* STARTER */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 text-center shadow-xl hover:scale-[1.02] transition">
          <h2 className="text-lg font-bold">Single Car Access</h2>
          <p className="text-gray-400 text-sm mt-1">Perfect for first-time buyers</p>

          <p className="text-4xl font-extrabold mt-4">$249</p>
          <p className="text-gray-500 text-xs">One-Time Access</p>

          <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left mx-auto w-fit">
            <li>✔ Access to 1 Copart purchase</li>
            <li>✔ Auction education</li>
            <li>✔ Lot condition breakdowns</li>
            <li>✔ Market value guidance</li>
            <li>✔ Chat support</li>
          </ul>

          <button className="w-full mt-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700">
            Buy Now
          </button>
        </div>

        {/* PRO */}
        <div className="bg-[#111] border border-green-700 rounded-xl p-6 text-center shadow-xl hover:scale-[1.02] transition">
          <h2 className="text-lg font-bold text-green-400">3-Car Access</h2>
          <p className="text-gray-400 text-sm mt-1">For growing buyers</p>

          <p className="text-4xl font-extrabold mt-4">$599</p>
          <p className="text-gray-500 text-xs">Up to 3 Cars</p>

          <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left mx-auto w-fit">
            <li>✔ Everything in Starter</li>
            <li>✔ Priority lot reviews</li>
            <li>✔ Faster bid processing</li>
            <li>✔ Up to 3 cars simultaneously</li>
            <li>✔ Lower broker fees</li>
          </ul>

          <button className="w-full mt-6 py-3 border border-green-500 text-green-400 rounded-xl hover:bg-green-900/30">
            Upgrade
          </button>
        </div>

        {/* ELITE (MOST POPULAR) */}
        <div className="bg-[#1a1a1a] border-2 border-yellow-500 rounded-xl p-6 text-center shadow-2xl relative hover:scale-[1.03] transition">
          <span className="absolute -top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </span>

          <h2 className="text-lg font-bold text-yellow-400">5-Car Elite</h2>
          <p className="text-gray-400 text-sm mt-1">For serious flippers</p>

          <p className="text-4xl font-extrabold mt-4">$899</p>
          <p className="text-gray-500 text-xs">Up to 5 Cars</p>

          <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left mx-auto w-fit">
            <li>✔ Early access to hot lots</li>
            <li>✔ Personalized recommendations</li>
            <li>✔ Title & paperwork coaching</li>
            <li>✔ VIP support queue</li>
            <li>✔ Best savings on fees</li>
          </ul>

          <button className="w-full mt-6 py-3 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300">
            Go Elite
          </button>
        </div>

        {/* MAX */}
        <div className="bg-[#111] border border-red-600 rounded-xl p-6 text-center shadow-xl hover:scale-[1.02] transition">
          <h2 className="text-lg font-bold text-red-400">10-Car Max</h2>
          <p className="text-gray-400 text-sm mt-1">Best for exporters & dealers</p>

          <p className="text-4xl font-extrabold mt-4">$1299</p>
          <p className="text-gray-500 text-xs">Up to 10 Cars</p>

          <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left mx-auto w-fit">
            <li>✔ Everything in Elite</li>
            <li>✔ Maximum bidding priority</li>
            <li>✔ First look at premium lots</li>
            <li>✔ Dedicated broker agent</li>
            <li>✔ Largest buying power benefits</li>
          </ul>

          <button className="w-full mt-6 py-3 bg-red-600 rounded-xl hover:bg-red-700">
            Unlock Max
          </button>
        </div>

      </section>


      {/* ───── FEATURED CARS ───── */}
      <section className="max-w-7xl mx-auto mt-20 px-6">
        <h2 className="text-3xl font-bold text-center">Featured Copart Vehicles</h2>
        <p className="text-gray-400 text-center mt-2 text-sm">
          Real deals available right now — don’t miss out.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">

          <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
            <img src="/car1.jpg" className="rounded-xl mb-3" />
            <h3 className="text-lg font-bold">2021 Dodge Charger</h3>
            <p className="text-gray-400 text-sm">Run & Drive • Clean Title</p>
            <p className="text-blue-400 text-lg font-bold mt-2">$12,500 Market Value</p>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
            <img src="/car2.jpg" className="rounded-xl mb-3" />
            <h3 className="text-lg font-bold">2018 BMW 430i</h3>
            <p className="text-gray-400 text-sm">Minor Damage</p>
            <p className="text-blue-400 text-lg font-bold mt-2">$9,900 Market Value</p>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
            <img src="/car3.jpg" className="rounded-xl mb-3" />
            <h3 className="text-lg font-bold">2020 Tesla Model 3</h3>
            <p className="text-gray-400 text-sm">Electric • Front Damage</p>
            <p className="text-blue-400 text-lg font-bold mt-2">$16,700 Market Value</p>
          </div>
        </div>
      </section>


      {/* ───── SILVER V6 BOT ───── */}
      <img
        src="/silverv6.png"
        className="fixed bottom-6 right-6 w-28 opacity-90 hover:opacity-100 cursor-pointer drop-shadow-xl"
        title="Need help? SilverV6 is here."
      />

    </div>
  );
}

import StartTrialButton from "@/components/StartTrialButton";

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
            <a
              href="/login"
              className="text-blue-400 font-semibold hover:text-blue-300"
            >
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

        {/* SINGLE */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 text-center shadow-xl hover:scale-[1.02] transition">
          <h2 className="text-lg font-bold">Single Car Access</h2>
          <p className="text-gray-400 text-sm mt-1">Perfect for first-time buyers</p>

          <p className="text-4xl font-extrabold mt-4">$249</p>
          <p className="text-gray-500 text-xs">Monthly Subscription</p>

          <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left mx-auto w-fit">
            <li>✔ Access to 1 Copart purchase</li>
            <li>✔ Auction education</li>
            <li>✔ Lot condition breakdowns</li>
            <li>✔ Market value guidance</li>
            <li>✔ Chat support</li>
          </ul>

          <div className="mt-6">
            <StartTrialButton plan="single" />
            <p className="text-xs text-gray-400 mt-2">
              7-day free trial • No bidding during trial
            </p>
          </div>
        </div>

        {/* 3 CAR */}
        <div className="bg-[#111] border border-green-700 rounded-xl p-6 text-center shadow-xl hover:scale-[1.02] transition">
          <h2 className="text-lg font-bold text-green-400">3-Car Access</h2>
          <p className="text-gray-400 text-sm mt-1">For growing buyers</p>

          <p className="text-4xl font-extrabold mt-4">$599</p>
          <p className="text-gray-500 text-xs">Monthly Subscription</p>

          <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left mx-auto w-fit">
            <li>✔ Everything in Single</li>
            <li>✔ Priority lot reviews</li>
            <li>✔ Faster bid processing</li>
            <li>✔ Up to 3 cars</li>
            <li>✔ Lower broker fees</li>
          </ul>

          <div className="mt-6">
            <StartTrialButton plan="three" />
            <p className="text-xs text-gray-400 mt-2">
              7-day free trial • No bidding during trial
            </p>
          </div>
        </div>

        {/* 5 CAR (POPULAR) */}
        <div className="bg-[#1a1a1a] border-2 border-yellow-500 rounded-xl p-6 text-center shadow-2xl relative hover:scale-[1.03] transition">
          <span className="absolute -top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </span>

          <h2 className="text-lg font-bold text-yellow-400">5-Car Elite</h2>
          <p className="text-gray-400 text-sm mt-1">For serious flippers</p>

          <p className="text-4xl font-extrabold mt-4">$899</p>
          <p className="text-gray-500 text-xs">Monthly Subscription</p>

          <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left mx-auto w-fit">
            <li>✔ Early access to hot lots</li>
            <li>✔ Personalized recommendations</li>
            <li>✔ Title & paperwork coaching</li>
            <li>✔ VIP support queue</li>
            <li>✔ Best broker fee discounts</li>
          </ul>

          <div className="mt-6">
            <StartTrialButton plan="five" />
            <p className="text-xs text-gray-400 mt-2">
              7-day free trial • No bidding during trial
            </p>
          </div>
        </div>

        {/* 10 CAR */}
        <div className="bg-[#111] border border-red-600 rounded-xl p-6 text-center shadow-xl hover:scale-[1.02] transition">
          <h2 className="text-lg font-bold text-red-400">10-Car Max</h2>
          <p className="text-gray-400 text-sm mt-1">Exporters & power buyers</p>

          <p className="text-4xl font-extrabold mt-4">$1299</p>
          <p className="text-gray-500 text-xs">Monthly Subscription</p>

          <ul className="text-gray-300 mt-4 space-y-2 text-sm text-left mx-auto w-fit">
            <li>✔ Everything in Elite</li>
            <li>✔ Maximum bidding priority</li>
            <li>✔ Premium lot access</li>
            <li>✔ Dedicated broker agent</li>
            <li>✔ Highest buying power</li>
          </ul>

          <div className="mt-6">
            <StartTrialButton plan="ten" />
            <p className="text-xs text-gray-400 mt-2">
              7-day free trial • No bidding during trial
            </p>
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

"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const supabase = createClientComponentClient();

  const [deposit, setDeposit] = useState<any>(null);
  const [buyingPower, setBuyingPower] = useState<number>(0);
  const [activeBids, setActiveBids] = useState<number>(0);
  const [pendingFees, setPendingFees] = useState<number>(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // GET DEPOSIT
    const { data: dep } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (dep) {
      setDeposit(dep);
      const available = dep.total_deposit - dep.locked_deposit;
      setBuyingPower(Math.floor(available / 0.13));
    }

    // ACTIVE BIDS
    const { data: bids } = await supabase
      .from("bids")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active");

    setActiveBids(bids?.length || 0);

    // PENDING FEES
    const { data: fees } = await supabase
      .from("broker_fees")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending");

    setPendingFees(fees?.length || 0);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="w-full py-6 flex flex-col items-center">
        <Image src="/v6-logo.png" width={90} height={90} alt="V6 Auto Broker" />
        <nav className="flex gap-8 mt-4 text-gray-300 text-sm">
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/profile">Settings</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
      </header>

      {/* ================= TITLE ================= */}
      <div className="text-center mt-4">
        <h1 className="text-4xl font-bold">Your Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Everything you need to buy cars like a dealer.
        </p>
      </div>

      {/* ================= GRID CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 px-8 md:px-20">

        {/* Buying Power */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-900/40 transition">
          <h2 className="text-xl font-bold mb-2">Buying Power</h2>
          <p className="text-4xl font-extrabold text-blue-400">
            ${buyingPower.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">Based on 13% deposit rule</p>
        </div>

        {/* Deposit Balance */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-900/40 transition">
          <h2 className="text-xl font-bold mb-2">Your Deposit</h2>
          {deposit ? (
            <>
              <p className="text-3xl font-bold">${deposit.total_deposit}</p>
              <p className="text-green-400 text-sm">Available: ${deposit.total_deposit - deposit.locked_deposit}</p>
              <p className="text-red-400 text-sm">Locked: ${deposit.locked_deposit}</p>

              <Link
                href="/deposits"
                className="mt-3 inline-block bg-blue-600 px-5 py-2 rounded-xl text-white"
              >
                Manage Deposit
              </Link>
            </>
          ) : (
            <p>No deposit data</p>
          )}
        </div>

        {/* Active Bids */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-900/40 transition">
          <h2 className="text-xl font-bold">Active Bids</h2>
          <p className="text-4xl font-bold text-yellow-400">{activeBids}</p>
          <Link href="/dashboard/my-bids" className="text-blue-400 underline mt-2 block">
            View My Bids
          </Link>
        </div>

        {/* Pending Broker Fees */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-900/40 transition">
          <h2 className="text-xl font-bold">Pending Broker Fees</h2>
          <p className="text-4xl font-bold text-red-400">{pendingFees}</p>
          <Link href="/dashboard/broker-fees" className="text-blue-400 underline mt-2 block">
            View Details
          </Link>
        </div>

        {/* Shipping Estimator */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-900/40 transition">
          <h2 className="text-xl font-bold">Shipping Estimator</h2>
          <p className="text-gray-400 text-sm">Find cost from Copart yard to your location</p>
          <Link
            href="/shipping"
            className="mt-3 inline-block bg-blue-600 px-5 py-2 rounded-xl text-white"
          >
            Estimate Shipping
          </Link>
        </div>

        {/* Copart Featured Lots */}
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-900/40 transition">
          <h2 className="text-xl font-bold">Featured Lots</h2>
          <p className="text-gray-400">Browse hot deals from Copart instantly</p>
          <Link
            href="/dashboard/live-lots"
            className="mt-3 inline-block bg-blue-600 px-5 py-2 rounded-xl text-white"
          >
            View Lots
          </Link>
        </div>
      </div>

      {/* ================= GOLDV6 BOTTOM RIGHT ================= */}
      <div className="fixed bottom-6 right-6 opacity-80 hover:opacity-100 transition">
        <Image
          src="/goldv6.png"
          width={130}
          height={130}
          alt="Gold V6 Mascot"
          className="drop-shadow-[0_0_10px_gold]"
        />
      </div>
    </div>
  );
}

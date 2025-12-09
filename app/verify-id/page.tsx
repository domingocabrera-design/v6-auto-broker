"use client";

import Link from "next/link";

export default function DashboardPage() {
  // TEMP hard-coded numbers – later we load from Supabase
  const totalDeposit = 1000;
  const reserved = 400;
  const available = totalDeposit - reserved;

  // TEMP hard-coded compliance status – later read from DB
  const status = {
    depositVerified: true,
    idVerified: false,
    termsAccepted: false,
  };

  return (
    <main className="min-h-screen bg-neutral-100 py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold text-neutral-900">
          My V6 Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          View your deposit, active bids, and broker status.
        </p>

        {/* BIDDING READINESS */}
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Bidding Readiness
          </p>

          <div className="mt-3 grid gap-4 md:grid-cols-3">
            <ReadinessBadge
              label="Deposit on File"
              ok={status.depositVerified}
              detail={status.depositVerified ? "Ready" : "Add deposit to start"}
            />
            <ReadinessBadge
              label="Legal ID Verified"
              ok={status.idVerified}
              detail={status.idVerified ? "Approved" : "Upload your ID for review"}
            />
            <ReadinessBadge
              label="Terms Accepted"
              ok={status.termsAccepted}
              detail={status.termsAccepted ? "Accepted" : "Review and accept terms"}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {!status.idVerified && (
              <Link
                href="/verify-id"
                className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition"
              >
                Upload Legal ID
              </Link>
            )}
            {!status.depositVerified && (
              <button className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-800 hover:border-sky-500 hover:text-sky-600 transition">
                Add Deposit
              </button>
            )}
            {!status.termsAccepted && (
              <button className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-800 hover:border-sky-500 hover:text-sky-600 transition">
                View Terms
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-neutral-500">
            To place bids, you must have an active deposit, a verified legal ID, and
            accept the broker & deposit terms.
          </p>
        </section>

        {/* BALANCE CARDS */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Card
            label="Total Deposit"
            value={`$${totalDeposit.toLocaleString()}`}
            subtitle="Money currently on file with V6"
          />
          <Card
            label="Reserved for Active Bids"
            value={`$${reserved.toLocaleString()}`}
            subtitle="Held while your bids are open"
          />
          <Card
            label="Available to Bid"
            value={`$${available.toLocaleString()}`}
            subtitle="You can use this for new bids"
          />
        </section>

        {/* ACTION BUTTONS */}
        <section className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition">
            Add Deposit
          </button>
          <button className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-800 hover:border-red-400 hover:text-red-500 transition">
            Request Deposit Refund
          </button>
        </section>

        {/* ACTIVE BIDS */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-neutral-900">
            Active Bids
          </h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-4 py-2 text-left">Vehicle</th>
                  <th className="px-4 py-2 text-left">Lot #</th>
                  <th className="px-4 py-2 text-left">Reserved</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* TEMP DUMMY ROWS */}
                <tr className="border-t border-neutral-100">
                  <td className="px-4 py-2">2020 Honda Civic</td>
                  <td className="px-4 py-2 text-neutral-600">58046565</td>
                  <td className="px-4 py-2">$200</td>
                  <td className="px-4 py-2 text-amber-600 font-medium">Open</td>
                </tr>
                <tr className="border-t border-neutral-100">
                  <td className="px-4 py-2">2018 Silverado 4x4</td>
                  <td className="px-4 py-2 text-neutral-600">12345678</td>
                  <td className="px-4 py-2">$200</td>
                  <td className="px-4 py-2 text-amber-600 font-medium">Open</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* TRANSACTIONS */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Activity
          </h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* TEMP DUMMY ROWS */}
                <tr className="border-t border-neutral-100">
                  <td className="px-4 py-2">2025-12-01</td>
                  <td className="px-4 py-2">Deposit</td>
                  <td className="px-4 py-2 text-emerald-600">+$1,000</td>
                </tr>
                <tr className="border-t border-neutral-100">
                  <td className="px-4 py-2">2025-12-05</td>
                  <td className="px-4 py-2">Broker Fee</td>
                  <td className="px-4 py-2 text-red-500">-$249</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function ReadinessBadge({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
      <span
        className={
          "mt-1 h-2.5 w-2.5 rounded-full " +
          (ok ? "bg-emerald-500" : "bg-amber-400")
        }
      />
      <div>
        <p className="text-xs font-semibold text-neutral-800">{label}</p>
        <p className="text-xs text-neutral-500">{detail}</p>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>
    </div>
  );
}

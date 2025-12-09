"use client";

import { useEffect, useState } from "react";

export default function BrokerFeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [receipt, setReceipt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  async function loadFees() {
    setLoading(true);
    const userId = localStorage.getItem("user_id"); // Adjust if using Supabase auth session

    const res = await fetch(`/api/broker/fees?userId=${userId}`);
    const data = await res.json();

    setFees(data.fees || []);
    setLoading(false);
  }

  async function openReceipt(id: string) {
    const res = await fetch(`/api/broker/fees/${id}`);
    const data = await res.json();
    setReceipt(data.fee);
    setShowModal(true);
  }

  useEffect(() => {
    loadFees();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Broker Fees</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : fees.length === 0 ? (
        <p className="text-gray-400">No broker fees found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-900 text-gray-400">
              <tr>
                <th className="p-3 text-left">Lot</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Paid Via</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Receipt</th>
              </tr>
            </thead>

            <tbody>
              {fees.map((fee) => (
                <tr
                  key={fee.id}
                  className="border-t border-gray-800 hover:bg-gray-900 transition"
                >
                  <td className="p-3 font-semibold">{fee.lot_number}</td>

                  <td className="p-3">${fee.broker_fee}</td>

                  <td className="p-3 capitalize">
                    {fee.paid_via === "deposit" ? (
                      <span className="text-green-400 font-semibold">Deposit</span>
                    ) : (
                      <span className="text-blue-400 font-semibold">Stripe</span>
                    )}
                  </td>

                  <td className="p-3">
                    {fee.status === "paid" ? (
                      <span className="bg-green-600 px-3 py-1 rounded-lg text-xs">
                        Paid
                      </span>
                    ) : fee.status === "pending" ? (
                      <span className="bg-yellow-600 px-3 py-1 rounded-lg text-xs">
                        Pending
                      </span>
                    ) : (
                      <span className="bg-red-600 px-3 py-1 rounded-lg text-xs">
                        Failed
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-gray-400">
                    {new Date(fee.created_at).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => openReceipt(fee.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Totals Section */}
      {!loading && fees.length > 0 && (
        <div className="mt-10 p-5 rounded-xl bg-gray-900 border border-gray-800">
          <h2 className="text-xl font-bold mb-3">Totals</h2>

          <p className="text-gray-300">
            Total Paid:{" "}
            <span className="text-green-400 font-semibold">
              $
              {fees
                .filter((f) => f.status === "paid")
                .reduce((sum, f) => sum + f.broker_fee, 0)}
            </span>
          </p>

          <p className="text-gray-300">
            Pending Fees:{" "}
            <span className="text-yellow-400 font-semibold">
              $
              {fees
                .filter((f) => f.status === "pending")
                .reduce((sum, f) => sum + f.broker_fee, 0)}
            </span>
          </p>

          <p className="text-gray-300">
            Failed Fees:{" "}
            <span className="text-red-400 font-semibold">
              $
              {fees
                .filter((f) => f.status === "failed")
                .reduce((sum, f) => sum + f.broker_fee, 0)}
            </span>
          </p>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {showModal && receipt && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-6">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-xl">

            <h2 className="text-xl font-bold mb-4">Broker Fee Receipt</h2>

            <div className="space-y-3 text-gray-300">
              <p>
                <span className="font-semibold text-white">Lot Number:</span>{" "}
                {receipt.lot_number}
              </p>

              <p>
                <span className="font-semibold text-white">Broker Fee:</span> $
                {receipt.broker_fee}
              </p>

              <p>
                <span className="font-semibold text-white">Paid Via:</span>{" "}
                {receipt.paid_via === "deposit" ? (
                  <span className="text-green-400">Deposit</span>
                ) : (
                  <span className="text-blue-400">Stripe</span>
                )}
              </p>

              {/* Breakdown */}
              <h3 className="text-lg font-semibold mt-4 mb-2">Fee Breakdown</h3>

              <div className="space-y-2 text-sm">

                {receipt.breakdown?.title_handling_processing && (
                  <p>
                    <span className="font-semibold text-white">
                      Title Handling & Processing:
                    </span>{" "}
                    ${receipt.breakdown.title_handling_processing}
                  </p>
                )}

                <p>
                  <span className="font-semibold text-white">
                    Broker Service Fee:
                  </span>{" "}
                  ${receipt.breakdown.broker_service_fee}
                </p>
              </div>

              <p className="font-bold text-xl mt-4">
                Total: ${receipt.broker_fee}
              </p>

              <p className="text-gray-400 text-sm mt-3">
                {new Date(receipt.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

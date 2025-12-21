"use client";

import { Fragment } from "react";

type UpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  data?: {
    current_plan?: string;
    max_bids?: number;
    suggested_plan?: string;
    message?: string;
  } | null;
};

export default function UpgradeModal({
  open,
  onClose,
  data,
}: UpgradeModalProps) {
  if (!open) return null;

  return (
    <Fragment>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/70" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-[#0f0f12] border border-gray-800 p-6 text-white shadow-2xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">
              🚀 Upgrade Required
            </h2>
            <p className="text-sm text-gray-400">
              {data?.message ||
                "You’ve reached the maximum number of active bids for your plan."}
            </p>
          </div>

          {/* Info */}
          <div className="mt-4 rounded-xl bg-[#16161a] p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Plan</span>
              <span className="font-semibold">
                {data?.current_plan || "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Bid Limit</span>
              <span className="font-semibold">
                {data?.max_bids ?? "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Recommended</span>
              <span className="font-semibold text-green-400">
                {data?.suggested_plan || "Upgrade Plan"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                // Later you can swap this for Stripe Checkout URL
                window.location.href = "/pricing";
              }}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-2.5 font-semibold text-black hover:opacity-90 transition"
            >
              Upgrade Now
            </button>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#222] py-2.5 text-gray-300 hover:bg-[#2a2a2a] transition"
            >
              Cancel
            </button>
          </div>

          {/* Footer note */}
          <p className="mt-4 text-center text-xs text-gray-500">
            Upgrade instantly to unlock more bidding power.
          </p>
        </div>
      </div>
    </Fragment>
  );
}

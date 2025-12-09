"use client";

import Image from "next/image";

type LotPreviewProps = {
  lot: {
    lot_id: string | number;
    year?: number;
    make?: string;
    model?: string;
    odometer?: number | string | null;
    primary_damage?: string | null;
    auction_date?: string | null;
    status?: string | null;
    buy_it_now?: number | null;
    image_url?: string | null;
  };
};

export default function LotPreviewCard({ lot }: LotPreviewProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition">
      {/* IMAGE */}
      <div className="relative w-full h-48 mb-3">
        {lot.image_url ? (
          <Image
            src={lot.image_url}
            alt={`${lot.make} ${lot.model}`}
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* INFO */}
      <h3 className="font-semibold text-lg">
        {lot.year} {lot.make} {lot.model}
      </h3>

      <p className="text-sm text-gray-600">
        Odometer: {lot.odometer || "N/A"}
      </p>

      <p className="text-sm text-gray-600">
        Damage: {lot.primary_damage || "Unknown"}
      </p>

      <p className="text-sm text-gray-600">
        Auction: {lot.auction_date || "N/A"}
      </p>

      {lot.buy_it_now && (
        <p className="text-green-600 font-bold mt-2">
          Buy Now: ${lot.buy_it_now}
        </p>
      )}
    </div>
  );
}

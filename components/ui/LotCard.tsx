"use client";

type LotCardProps = {
  lot: any;
};

export default function LotCard({ lot }: LotCardProps) {
  return (
    <div className="bg-[#16161a] rounded-xl p-4 border border-gray-800">
      <div className="font-semibold mb-2">
        {lot?.year} {lot?.make} {lot?.model}
      </div>
      <div className="text-sm text-gray-400">
        Lot ID: {lot?.id || "N/A"}
      </div>
    </div>
  );
}

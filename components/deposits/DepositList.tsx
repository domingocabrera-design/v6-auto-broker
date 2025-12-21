"use client";

type Deposit = {
  id: string;
  lot_id: string;
  amount: number;
  status: string;
  locked_until: string;
};

export default function DepositList({ deposits }: { deposits: Deposit[] }) {
  return (
    <div className="space-y-4">
      {deposits.map((d) => (
        <div
          key={d.id}
          className="border border-gray-700 rounded-lg p-4 bg-[#0f0f0f]"
        >
          <p className="font-bold">Lot #{d.lot_id}</p>
          <p>Deposit: ${d.amount}</p>
          <p>Status: <strong>{d.status.toUpperCase()}</strong></p>

          {d.status === "locked" && (
            <p className="text-sm text-yellow-400">
              Locked until {new Date(d.locked_until).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

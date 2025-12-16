import Link from "next/link";

export default function LotCard({ lot }: any) {
  return (
    <div className="bg-black border border-gray-800 hover:border-blue-600 rounded-xl overflow-hidden transition shadow-md">
      <img
        src={lot.image || "/placeholder-car.png"}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-semibold">
          {lot.year} {lot.make} {lot.model}
        </h2>

        <p className="text-gray-400 text-sm">Damage: {lot.damage}</p>
        <p className="text-gray-400 text-sm">Odometer: {lot.odometer}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-blue-500 font-bold text-lg">
            {lot.currentBid ? `$${lot.currentBid}` : "No Bid"}
          </span>

          <Link
            href={`/lots/${lot.id}`}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
          >
            View Lot
          </Link>
        </div>
      </div>
    </div>
  );
}

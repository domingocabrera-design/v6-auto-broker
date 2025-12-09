import PlaceBidButton from "@/components/PlaceBidButton";
import ProfitCalculator from "@/components/ProfitCalculator";
import Image from "next/image";

type LotPageProps = {
  params: { lotId: string };
};

export default async function LotPage({ params }: LotPageProps) {
  const lotId = params.lotId;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/copart/live/${lotId}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!data.success) {
    return (
      <div className="p-10 text-red-500 text-center">
        <h1 className="text-3xl font-bold">Lot Not Found</h1>
      </div>
    );
  }

  const lot = data.lot;
  const marketValue = Number(lot?.acv) || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white space-y-10">
      <h1 className="text-4xl font-bold">
        {lot.year} {lot.make} {lot.model}
      </h1>

      {/* IMAGE */}
      {lot.image && (
        <Image
          src={lot.image}
          width={800}
          height={450}
          alt="Lot Image"
          className="rounded-xl"
        />
      )}

      {/* BID SECTION */}
      <div className="bg-[#1b1b1b] p-6 rounded-xl space-y-3">
        <h2 className="text-2xl font-bold">Place Your Bid</h2>

        <PlaceBidButton
          lot_id={String(lotId)}
          lot_price={lot.currentBid || 0}
        />
      </div>

      {/* PROFIT CALCULATOR */}
      <ProfitCalculator marketValue={marketValue} />
    </div>
  );
}

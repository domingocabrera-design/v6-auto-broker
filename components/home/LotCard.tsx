import Countdown from "./Countdown";

export default function LotCard({ lot }: any) {
  return (
    <div className="bg-neutral-800 rounded-2xl p-4 card-soft card-soft-hover">
      <img
        src={lot.image_url}
        alt={`${lot.year} ${lot.make}`}
        className="featured-img"
      />

      <h3 className="mt-3 font-semibold text-white text-base">
        {lot.year} {lot.make} {lot.model}
      </h3>

      <p className="text-xs text-gray-400">{lot.damage}</p>

      {lot.sale_date && <Countdown saleDate={lot.sale_date} />}

      <p className="text-green-400 font-bold mt-2 text-lg">
        ${Number(lot.buy_it_now || 0).toLocaleString()}
      </p>

      <a
        href={`/lots/${lot.id}`}
        className="btn-secondary block text-center mt-4 w-full"
      >
        View Vehicle
      </a>
    </div>
  );
}

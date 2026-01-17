import { createClient } from "@supabase/supabase-js";
import LotCard from "./LotCard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function FeaturedLots() {
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("auction_source", "copart")
    .order("sale_date", { ascending: true })
    .limit(8);

  if (!vehicles?.length) return null;

  return (
    <section className="bg-black py-14">
      <h2 className="text-xl font-bold text-center text-white mb-6">
        Featured Vehicles <span className="text-gray-400">Ending Soon</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 max-w-7xl mx-auto px-4">
        {vehicles.map(v => (
          <LotCard key={v.id} lot={v} />
        ))}
      </div>

      <div className="text-center mt-8">
        <a href="/browse" className="btn-secondary">
          View All Vehicles
        </a>
      </div>
    </section>
  );
}

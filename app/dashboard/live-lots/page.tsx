import { createServerClient } from "@/lib/supabase/server";
import LotPreviewCard from "@/components/LotPreviewCard";

export default async function LiveLotsPage() {
  const supabase = createServerClient();

  const { data: lots } = await supabase
    .from("lots")
    .select(`
      lot_id,
      year,
      make,
      model,
      odometer,
      primary_damage,
      auction_date,
      status,
      buy_it_now,
      lot_images ( image_url )
    `)
    .limit(50);

  const normalized = lots?.map((l: any) => ({
    ...l,
    image_url: l.lot_images?.[0]?.image_url || null,
  }));

  return (
    <div className="px-8 py-6">
      <h1 className="text-3xl font-bold mb-6">Live Lots</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {normalized?.map((lot: any) => (
          <LotPreviewCard key={lot.lot_id} lot={lot} />
        ))}
      </div>
    </div>
  );
}

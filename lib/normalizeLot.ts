export default function normalizeLot(lotId: string, raw: any) {
  if (!raw) {
    return {
      id: lotId,
      title: "Unknown Vehicle",
      images: [],
      currentBid: 0,
      bidIncrement: 100,
      saleStatus: "N/A",
      auctionEndTime: null,
    };
  }

  return {
    id: lotId,
    title: `${raw.year || ""} ${raw.make || ""} ${raw.model || ""}`.trim(),

    // Images
    images: raw.images || [],

    // Bidding info
    currentBid: raw.currentBid || 0,
    bidIncrement: raw.bidIncrement || 100,
    saleStatus: raw.saleStatus || "N/A",
    auctionEndTime: raw.auctionEndTime || null,

    // Vehicle specs
    year: raw.year || null,
    make: raw.make || "",
    model: raw.model || "",
    odometer: raw.odometer || null,
    keys: raw.keys || false,

    // Damage
    primaryDamage: raw.primaryDamage || "",
    secondaryDamage: raw.secondaryDamage || "",
    condition: raw.condition || "",

    // Title info
    vin: raw.vin || "",
    titleType: raw.titleType || "",
    titleState: raw.titleState || "",
    titleBrand: raw.titleBrand || "",

    // Seller info
    sellerName: raw.sellerName || "",
    sellerType: raw.sellerType || "",
    sellerNotes: raw.sellerNotes || "",
    sellerPhone: raw.sellerPhone || "",

    // Yard info
    yard: {
      name: raw.yard?.name || "",
      address: raw.yard?.address || "",
      lat: raw.yard?.lat || null,
      lon: raw.yard?.lon || null,
    },

    // Location
    location: raw.location || "",
  };
}

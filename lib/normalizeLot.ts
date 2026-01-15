export default function normalizeLot(raw: any) {
  const d = raw.lotDetails || raw;

  const images =
    d.lotImages?.FULL?.map((i: any) => i.url) ||
    d.lotImages?.MAIN?.url ||
    [
      `https://content.copart.com/v1/AUTH_svc.pdoc00001/LPP/${d.lotNumberStr}/f_primary.jpg`,
    ];

  return {
    // ✅ MATCH DATABASE COLUMN
    lot_id: d.lotNumberStr,

    year: d.lotYear,
    make: d.make || d.lotMake,
    model: d.modelGroup || d.lotModel,
    vin: d.vin,

    images,

    currentBid: d.currentBid || d.largestBidAmount || 0,
    bidIncrement: d.minimumBid || 100,
    saleStatus: d.saleStatus || "Pending",
    buyItNow: d.buyItNow || null,
    auctionEndTime: d.auctionDate || null,

    odometer: d.odometer?.value || d.odometer || 0,
    primaryDamage: d.damageDescription || d.lotDamagePrimary,
    secondaryDamage: d.secondaryDamage || null,
    condition: d.vehicleCondition || null,
    keys: d.keysAvailable === "YES",

    sellerName: d.seller || "Unknown",
    sellerType: d.sellerType || "Unknown",
    sellerPhone: d.sellerPhone || null,

    titleType: d.titleType || d.titleGroup,
    titleBrand: d.titleBrand || null,
    titleState: d.titleState || null,

    yard: {
      name: d.facilityName || d.yardName,
      address: `${d.locationAddress}, ${d.locationCity}, ${d.locationState}`,
      lat: d.location?.lat || d.yardLat || 0,
      lon: d.location?.lon || d.yardLon || 0,
    },
  };
}

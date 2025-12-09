// /lib/copart/parser.ts

export interface LotRecord {
  lot_id: string;
  year: number | null;
  make: string | null;
  model: string | null;
  odometer: number | null;
  primary_damage: string | null;
  status: string | null;
  auction_date: string | null;
  buy_it_now: number | null;
  location: string | null;
}

export interface LotImageRecord {
  lot_id: string;
  image_url: string;
}

/**
 * Simple CSV parser (Copart CSV is clean, so no need for heavy dependencies)
 */
export function parseCSV(csvText: string): string[][] {
  return csvText
    .trim()
    .split("\n")
    .map((line) => line.split(","));
}

/**
 * Convert Copart CSV into structured objects for Supabase
 */
export function parseLots(csvText: string): {
  lots: LotRecord[];
  images: LotImageRecord[];
} {
  const rows = parseCSV(csvText);

  const header = rows[0];
  const dataRows = rows.slice(1);

  // Index lookup
  const idx = (name: string) => header.indexOf(name);

  const lots: LotRecord[] = [];
  const images: LotImageRecord[] = [];

  for (const row of dataRows) {
    if (!row[idx("LOT_NUMBER")]) continue;

    const lot_id = row[idx("LOT_NUMBER")].trim();

    const lot: LotRecord = {
      lot_id,
      year: parseInt(row[idx("YEAR")]) || null,
      make: row[idx("MAKE")] || null,
      model: row[idx("MODEL")] || null,
      odometer: parseInt(row[idx("ODOMETER")]) || null,
      primary_damage: row[idx("PRIMARY_DAMAGE")] || null,
      status: row[idx("STATUS")] || null,
      auction_date: row[idx("AUCTION_DATE")] || null,
      buy_it_now: parseFloat(row[idx("BUY_IT_NOW")]) || null,
      location: row[idx("LOCATION")] || null,
    };

    lots.push(lot);

    // Process images
    const imageCol = row[idx("IMAGES")] || "";
    const imageList = imageCol.split(";").filter((x) => x.trim().length > 1);

    for (const url of imageList) {
      images.push({
        lot_id,
        image_url: url,
      });
    }
  }

  return { lots, images };
}

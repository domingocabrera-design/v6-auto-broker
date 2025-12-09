import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as Papa from "papaparse";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();

    // Parse CSV
    const csv = Papa.parse(text, { header: true });
    const rows = csv.data as any[];

    // Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY! // needs service role key
    );

    for (const row of rows) {
      if (!row.Lot || !row.Make) continue;

      await supabase.from("lots").upsert({
        lot_id: row.Lot,
        make: row.Make,
        model: row.Model,
        year: parseInt(row.Year || 0),
        odometer: parseInt(row.Odometer || 0),
        damage: row.Damage,
        location: row.Location,
        sale_date: row.SaleDate,
        retail_value: parseFloat(row.RetailValue || 0),
        buy_it_price: parseFloat(row.BuyItNow || 0),
        img_url: row.ImageURL,
      });
    }

    return NextResponse.json({ success: true, inserted: rows.length });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}


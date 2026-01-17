import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🔐 Supabase service-role client (server only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ CSV file location
    const csvPath = path.join(
      process.cwd(),
      "data",
      "copart",
      "latest.csv"
    );

    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { error: "CSV file not found at data/copart/latest.csv" },
        { status: 400 }
      );
    }

    // 2️⃣ Read CSV as text (REAL CSV ONLY)
    const csvText = fs.readFileSync(csvPath, "utf8");

    // 3️⃣ Parse CSV (dirty-data safe)
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      trim: true,
      skip_records_with_error: true,
    });

    // 4️⃣ Map CSV → vehicles table (MATCHES YOUR HEADERS)
    const vehicles = records
      .map((row: any) => {
        if (!row["Lot number"]) return null;

        return {
          lot_number: String(row["Lot number"]).trim(),
          auction_source: "copart",

          year: Number(row["Year"]) || null,
          make: row["Make"]?.trim() || null,
          model: row["Model Group"]?.trim() || null,
          trim: row["Trim"]?.trim() || null,

          vin_masked: row["VIN"]
            ? String(row["VIN"]).slice(-6)
            : null,

          current_bid: null, // not included in this CSV
          buy_it_now: row["Buy-It-Now Price"]
            ? Number(row["Buy-It-Now Price"])
            : null,

          sale_date: row["Sale Date M/D/CY"] || null,
          sale_time: row["Sale time (HHMM)"] || null,

          location: [
            row["Location city"],
            row["Location state"],
          ]
            .filter(Boolean)
            .join(", "),

          primary_damage: row["Damage Description"]?.trim() || null,
          secondary_damage: row["Secondary Damage"]?.trim() || null,

          title_type: row["Sale Title Type"]?.trim() || null,
          odometer: Number(row["Odometer"]) || null,

          image_urls: row["Image URL"]
            ? [row["Image URL"].trim()]
            : [],
        };
      })
      .filter(Boolean);

    if (!vehicles.length) {
      return NextResponse.json(
        { error: "No valid rows found in CSV" },
        { status: 400 }
      );
    }

    // 5️⃣ Upsert into Supabase (dedupe by lot_number)
    const { error } = await supabase
      .from("vehicles")
      .upsert(vehicles, { onConflict: "lot_number" });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 6️⃣ Success
    return NextResponse.json({
      success: true,
      imported: vehicles.length,
    });

  } catch (err: any) {
    console.error("IMPORT ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Import failed" },
      { status: 500 }
    );
  }
}

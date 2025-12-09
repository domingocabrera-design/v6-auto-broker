import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  // Load ENV vars
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE;

  if (!url || !anon || !service) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing Supabase env variables",
        loaded: { url, anon, service }
      },
      { status: 400 }
    );
  }

  // Create Supabase client
  const supabase = createClient(url, service);

  try {
    // Example query: get 6 featured lots from database (or static fallback)
    // Adjust to match your own DB structure
    const { data, error } = await supabase
      .from("featured_lots")
      .select("*")
      .limit(6);

    if (error) throw error;

    // If DB has no featured lots, return fallback sample car
    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        cars: [
          {
            lot_id: "00000001",
            year: 2018,
            make: "Dodge",
            model: "Charger SRT Hellcat",
            image: "/placeholder-car.jpg",
            odometer: 54000,
            location: "Fallback Yard"
          }
        ]
      });
    }

    return NextResponse.json({
      success: true,
      cars: data,
    });
  } catch (err) {
    console.error("FEATURED LOTS API ERROR:", err);

    return NextResponse.json(
      { success: false, error: "Unable to load featured lots" },
      { status: 500 }
    );
  }
}

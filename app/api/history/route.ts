import { NextResponse } from "next/server";

// NHTSA Recall API
async function fetchRecalls(vin: string) {
  try {
    const res = await fetch(
      `https://api.nhtsa.gov/recalls/recallsByVehicle?vin=${vin}`
    );
    const json = await res.json();
    return json?.results || [];
  } catch (err) {
    console.log("Recall fetch error:", err);
    return [];
  }
}

// Free history logic
export async function POST(req: Request) {
  try {
    const { vin, titleBrand, titleState } = await req.json();

    if (!vin) {
      return NextResponse.json({ success: false, error: "Missing VIN" });
    }

    // ------------------------------
    // 1. RECALL CHECK
    // ------------------------------
    const recalls = await fetchRecalls(vin);

    // ------------------------------
    // 2. FLOOD RISK CHECK
    // ------------------------------
    const floodStates = ["LA", "FL", "SC", "TX", "MS", "GA", "NC", "AL"];

    const floodRisk =
      floodStates.includes(titleState) ||
      (titleBrand?.toLowerCase().includes("flood") ?? false);

    // ------------------------------
    // 3. SALVAGE / TOTAL LOSS CHECK
    // ------------------------------
    const salvageBrands = ["salvage", "junk", "rebuilt", "fire", "water"];

    const salvageFlag = salvageBrands.some((b) =>
      titleBrand?.toLowerCase().includes(b)
    );

    // ------------------------------
    // 4. THEFT RISK CHECK
    // ------------------------------
    const highTheftModels = ["charger", "challenger", "hellcat", "accord", "civic", "camry", "silverado"];

    const theftRisk = highTheftModels.some((m) =>
      vin.toLowerCase().includes(m)
    );

    // ------------------------------
    // 5. BASIC ODOMETER CHECK (no rollback detection)
    // ------------------------------
    const odometerFlag = false; // Placeholder for future expansion

    // ------------------------------
    // BUILD SUMMARY RESPONSE
    // ------------------------------
    return NextResponse.json({
      success: true,
      history: {
        recalls,
        floodRisk,
        salvageFlag,
        theftRisk,
        odometerFlag,
        issueCount:
          (recalls.length > 0 ? 1 : 0) +
          (floodRisk ? 1 : 0) +
          (salvageFlag ? 1 : 0) +
          (theftRisk ? 1 : 0),
      },
    });
  } catch (err) {
    console.log("History API Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

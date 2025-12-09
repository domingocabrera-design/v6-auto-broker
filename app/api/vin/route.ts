import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VinItem = {
  Variable: string;
  Value: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const { vin } = await req.json();

    if (!vin) {
      return NextResponse.json({ error: "VIN is required" }, { status: 400 });
    }

    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.Results as VinItem[];

    const specs = {
      make: results.find((r: VinItem) => r.Variable === "Make")?.Value || null,
      model: results.find((r: VinItem) => r.Variable === "Model")?.Value || null,
      modelYear:
        results.find((r: VinItem) => r.Variable === "Model Year")?.Value || null,
      trim: results.find((r: VinItem) => r.Variable === "Trim")?.Value || null,
    };

    return NextResponse.json({ success: true, vin, specs });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to decode VIN";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

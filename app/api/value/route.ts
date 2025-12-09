import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { year, make, model, trim, mileage, titleBrand, condition } =
      await req.json();

    // Safety fallback
    if (!year || !make || !model) {
      return NextResponse.json({
        success: false,
        error: "Missing year/make/model",
      });
    }

    // -------------------------------
    // BASE PRICE (simple valuation)
    // -------------------------------
    const basePrice =
      5000 +
      (year - 2000) * 400 +
      (trim?.toLowerCase().includes("sport") ? 1200 : 0) +
      (trim?.toLowerCase().includes("premium") ? 1800 : 0);

    // -------------------------------
    // MILEAGE ADJUSTMENT
    // -------------------------------
    let mileageAdj = 0;
    if (mileage) {
      if (mileage < 60000) mileageAdj = +1500;
      else if (mileage > 150000) mileageAdj = -2000;
      else mileageAdj = -Math.floor((mileage - 60000) / 20000) * 500;
    }

    // -------------------------------
    // TITLE BRAND DISCOUNT
    // -------------------------------
    let salvageDiscount = 0;
    if (titleBrand?.toLowerCase().includes("salvage")) salvageDiscount = -0.45;
    else if (titleBrand?.toLowerCase().includes("rebuilt")) salvageDiscount = -0.25;
    else salvageDiscount = 0;

    // -------------------------------
    // CONDITION ADJUSTMENT
    // -------------------------------
    let conditionAdj = 0;
    if (condition?.toLowerCase().includes("front")) conditionAdj = -1500;
    if (condition?.toLowerCase().includes("side")) conditionAdj = -1000;
    if (condition?.toLowerCase().includes("rear")) conditionAdj = -800;

    // -------------------------------
    // FINAL VALUE CALCULATION
    // -------------------------------
    const retailValue = Math.max(
      1000,
      basePrice + mileageAdj + conditionAdj
    );

    const salvageAdjusted =
      retailValue + retailValue * salvageDiscount;

    const auctionValue = salvageAdjusted * 0.75;

    return NextResponse.json({
      success: true,
      value: {
        retailValue: Math.round(retailValue),
        wholesaleValue: Math.round(retailValue * 0.85),
        auctionValue: Math.round(auctionValue),
        lowRange: Math.round(auctionValue * 0.9),
        highRange: Math.round(auctionValue * 1.15),
        salvageDiscount: salvageDiscount * 100,
      },
    });
  } catch (err) {
    console.log("Value API Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to calculate value" },
      { status: 500 }
    );
  }
}

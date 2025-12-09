import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      bid,
      marketValue,
      shipping,
      repairCost,
      auctionFeesPercent = 0.13, // default Copart 13%
      fixedFees = 200,           // gate fee, internet fee etc.
    } = await req.json();

    if (!bid || !marketValue) {
      return NextResponse.json({
        success: false,
        error: "Missing bid or market value",
      });
    }

    // Auction fees calculation
    const auctionFees = bid * auctionFeesPercent + fixedFees;

    // Total investment
    const totalCost = bid + auctionFees + (shipping || 0) + (repairCost || 0);

    // Profit
    const profit = marketValue - totalCost;

    // ROI %
    const roi = ((profit / totalCost) * 100).toFixed(1);

    // Recommended max bid (keeps 20% profit buffer)
    const recommendedMaxBid = Math.round(marketValue * 0.65);

    return NextResponse.json({
      success: true,
      profitCalc: {
        bid,
        marketValue,
        shipping,
        repairCost,
        auctionFees,
        totalCost,
        profit,
        roi,
        recommendedMaxBid,
      },
    });
  } catch (err) {
    console.error("PROFIT API ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Profit calculator failed" },
      { status: 500 }
    );
  }
}

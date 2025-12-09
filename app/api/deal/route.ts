import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      marketValue,
      bid,
      damage,
      titleBrand,
      historyIssues,
      profit,
      recommendedBid,
    } = await req.json();

    if (!marketValue || !bid) {
      return NextResponse.json({
        success: false,
        error: "Missing required data",
      });
    }

    // ----------------------------
    // SCORE CALCULATION
    // ----------------------------
    let score = 100;

    // Price vs Value
    const pctOfValue = bid / marketValue;
    if (pctOfValue > 0.8) score -= 35;
    else if (pctOfValue > 0.65) score -= 20;
    else if (pctOfValue > 0.50) score -= 10;
    else score += 10;

    // Damage severity
    if (damage?.toLowerCase().includes("frame")) score -= 35;
    if (damage?.toLowerCase().includes("engine")) score -= 25;
    if (damage?.toLowerCase().includes("front")) score -= 10;

    // Title brand impact
    if (titleBrand?.toLowerCase().includes("salvage")) score -= 20;
    if (titleBrand?.toLowerCase().includes("rebuilt")) score -= 10;

    // History issues
    score -= (historyIssues || 0) * 5;

    // Profitability
    if (profit < 0) score -= 30;
    if (profit > 1500) score += 10;
    if (profit > 3000) score += 20;

    // Clamp score 0–100
    score = Math.max(0, Math.min(100, score));

    // ----------------------------
    // AI VERDICT
    // ----------------------------
    let verdict = "";
    let action = "";

    if (score >= 80) {
      verdict = "🔥 Excellent Deal";
      action = "Strong buy — you should bid confidently.";
    } else if (score >= 65) {
      verdict = "👍 Good Deal";
      action = "Safe to bid — good value for the money.";
    } else if (score >= 50) {
      verdict = "⚠️ Fair Deal";
      action = `Stay cautious — recommended max bid is $${recommendedBid.toLocaleString()}.`;
    } else if (score >= 30) {
      verdict = "❌ Bad Deal";
      action = "Do NOT overbid — high risk compared to market value.";
    } else {
      verdict = "☠️ Very Bad Deal";
      action = "Avoid this car — serious financial risk.";
    }

    return NextResponse.json({
      success: true,
      analysis: {
        score,
        verdict,
        action,
      },
    });
  } catch (err) {
    console.error("Deal AI error:", err);
    return NextResponse.json(
      { success: false, error: "Deal analysis failed" },
      { status: 500 }
    );
  }
}

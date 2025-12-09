import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const csvUrl = process.env.COPART_CSV_URL;

    // TypeScript fix: check if undefined
    if (!csvUrl) {
      return NextResponse.json(
        { error: "COPART_CSV_URL is not set in environment variables" },
        { status: 500 }
      );
    }

    const res = await fetch(csvUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "CSV download failed" },
        { status: 500 }
      );
    }

    const csvText = await res.text();

    return new NextResponse(csvText, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
      },
    });

  } catch (err: any) {
    console.error("❌ CSV DOWNLOAD ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}

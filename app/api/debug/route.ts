import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "missing",
    role: process.env.SUPABASE_SERVICE_ROLE ? "loaded" : "missing",
    jwt: process.env.SUPABASE_JWT_SECRET ? "loaded" : "missing",
  });
}

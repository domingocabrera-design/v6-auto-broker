import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(`
      id,
      created_at,
      auth:auth.users (
        email
      )
    `)
    .order("created_at", {
      foreignTable: "auth.users",
      ascending: false,
    });

  if (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    users: data.map((u: any) => ({
      id: u.id,
      email: u.auth?.email ?? "—",
      created_at: u.created_at,
    })),
  });
}

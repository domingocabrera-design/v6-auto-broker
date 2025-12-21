import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { allowed: false },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_frozen")
    .eq("id", user.id)
    .single();

  if (profile?.is_frozen) {
    return NextResponse.json({
      allowed: false,
      reason: "ACCOUNT_FROZEN",
    });
  }

  return NextResponse.json({ allowed: true });
}

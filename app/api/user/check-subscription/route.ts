import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 1️⃣ Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ subscribed: false });
    }

    // 2️⃣ Check subscription table
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!sub) {
      return NextResponse.json({ subscribed: false });
    }

    // 3️⃣ Subscribed ✅
    return NextResponse.json({ subscribed: true });

  } catch (err) {
    console.error("check-subscription error:", err);
    return NextResponse.json({ subscribed: false });
  }
}

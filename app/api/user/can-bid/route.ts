import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { enforceNotFrozen } from "@/lib/enforceNotFrozen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  /* ───── COOKIES (SYNC IN NEXT 16) ───── */
  const cookieStore = cookies();

  const supabase = createRouteHandlerClient({
    cookies: () => Promise.resolve(cookieStore), // ✅ FIX
  });

  /* 1️⃣ AUTH */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { canBid: false, reason: "Not authenticated" },
      { status: 401 }
    );
  }

  /* 2️⃣ FREEZE CHECK */
  const freeze = await enforceNotFrozen(user.id);

  if (!freeze.allowed) {
    return NextResponse.json(
      { canBid: false, reason: freeze.reason },
      { status: 403 }
    );
  }

  /* 3️⃣ ALLOWED */
  return NextResponse.json({ canBid: true });
}

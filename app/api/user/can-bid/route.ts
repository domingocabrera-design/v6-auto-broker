import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { enforceNotFrozen } from "@/lib/enforceNotFrozen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // ✅ DO NOT await cookies() in Next.js 16
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

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

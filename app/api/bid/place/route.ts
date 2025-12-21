import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { enforceBidLimit } from "@/lib/enforceBidLimit";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const enforcement = await enforceBidLimit(user.id);

  if (!enforcement.allowed) {
    return NextResponse.json(
      {
        error: enforcement.reason,
        used: enforcement.used,
        limit: enforcement.limit,
      },
      { status: 403 }
    );
  }

  /* ───── Proceed with bid / win logic ───── */

  return NextResponse.json({ success: true });
}

import { enforceNotFrozen } from "@/lib/enforceNotFrozen";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ frozen: false });
  }

  const freeze = await enforceNotFrozen(user.id);

  return NextResponse.json({
    frozen: !freeze.allowed,
    reason: freeze.reason ?? null,
  });
}

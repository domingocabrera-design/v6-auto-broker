"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

/* ──────────────────────────────────────────────
   ADMIN AUTH (used by multiple actions)
────────────────────────────────────────────── */
async function getAdminUser() {
  // ✅ MUST await cookies() in server actions
  const cookieStore = await cookies();

  // ✅ NO Promise.resolve
  const supabaseAuth = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

/* ──────────────────────────────────────────────
   FREEZE / UNFREEZE USER
────────────────────────────────────────────── */
export async function setUserFrozen(
  targetUserId: string,
  frozen: boolean
) {
  await getAdminUser();

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ is_frozen: frozen })
    .eq("id", targetUserId);

  if (error) {
    throw new Error(error.message);
  }
}

/* ──────────────────────────────────────────────
   UPDATE BID OVERRIDE
────────────────────────────────────────────── */
export async function updateBidOverride(
  userId: string,
  bidOverride: number | null
) {
  await getAdminUser();

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ bid_override: bidOverride })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

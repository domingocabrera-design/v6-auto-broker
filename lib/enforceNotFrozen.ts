import { supabaseAdmin } from "@/lib/supabase/admin";

export async function enforceNotFrozen(userId: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("is_frozen")
    .eq("id", userId)
    .single();

  if (profile?.is_frozen) {
    return {
      allowed: false,
      reason: "Account temporarily frozen by admin",
    };
  }

  return { allowed: true };
}

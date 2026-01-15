import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

/**
 * Admin route guard
 * Next.js 16 + React 19 SAFE
 * LOCKED – DO NOT CHANGE
 */
export async function isAdminRoute() {
  // cookies() is SYNC in Next.js 16
  const cookieStore = cookies();

  const supabase = createRouteHandlerClient({
    // Supabase expects a Promise-returning cookies function
    cookies: async () => cookieStore,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return profile?.is_admin === true;
}

"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabase() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function forceActivate(subscriptionId: string) {
  const supabase = getSupabase();

  await supabase
    .from("subscriptions")
    .update({ status: "active" })
    .eq("id", subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  const supabase = getSupabase();

  await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("id", subscriptionId);
}

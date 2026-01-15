"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

function getSupabase() {
  return createServerActionClient({
    cookies,
  });
}

export async function forceActivate(subscriptionId: string) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "active" })
    .eq("id", subscriptionId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function cancelSubscription(subscriptionId: string) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("id", subscriptionId);

  if (error) {
    throw new Error(error.message);
  }
}

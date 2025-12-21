import supabaseServer from "@/lib/supabaseServer";

export async function checkSubscriptionAccess(userId: string) {
  const supabase = supabaseServer();

  const { data: sub, error } = await supabase
    .from("subscriptions")
    .select("status, trial_ends_at")
    .eq("user_id", userId)
    .single();

  if (error || !sub) {
    return {
      allowed: false,
      reason: "NO_SUBSCRIPTION",
    };
  }

  const allowed =
    sub.status === "active" ||
    sub.status === "trialing";

  return {
    allowed,
    status: sub.status,
    trialEndsAt: sub.trial_ends_at,
  };
}

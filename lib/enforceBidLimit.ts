import { supabaseAdmin } from "@/lib/supabase/admin";
import { getPlanLimit } from "@/lib/planLimits";

export async function enforceBidLimit(userId: string) {
  /* ───── Load profile + subscription ───── */
  const [{ data: profile }, { data: sub }] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("admin_bid_limit_override")
      .eq("id", userId)
      .single(),

    supabaseAdmin
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", userId)
      .single(),
  ]);

  if (!sub || !["active", "trialing"].includes(sub.status)) {
    return {
      allowed: false,
      reason: "No active subscription",
    };
  }

  /* ───── Count wins ───── */
  const { count: winsCount } = await supabaseAdmin
    .from("wins")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const used = winsCount ?? 0;

  /* ───── Determine limit ───── */
  const adminOverride = profile?.admin_bid_limit_override;
  const planLimit = getPlanLimit(sub.plan);

  const limit =
    adminOverride !== null && adminOverride !== undefined
      ? adminOverride
      : planLimit;

  /* ───── Enforce ───── */
  if (used >= limit) {
    return {
      allowed: false,
      reason:
        adminOverride !== null
          ? "Admin override limit reached"
          : "Plan limit reached",
      used,
      limit,
    };
  }

  return {
    allowed: true,
    used,
    limit,
  };
}

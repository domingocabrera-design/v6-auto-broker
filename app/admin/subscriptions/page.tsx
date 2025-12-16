import { supabaseAdmin } from "@/lib/supabase/admin";

/* ───────────────────────────────────── */
/* ADMIN SUBSCRIPTIONS (STABLE VERSION) */
/* ───────────────────────────────────── */

export default async function AdminSubscriptionsPage() {
  const { data: subs, error } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      user_id,
      status,
      trial_ends_at,
      created_at,
      stripe_subscription_id
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load subscriptions: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin — Subscriptions (Stable)
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-900 text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Trial Ends</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Stripe Sub</th>
            </tr>
          </thead>

          <tbody>
            {subs?.map((sub) => (
              <tr
                key={sub.id}
                className="border-t border-gray-800 text-sm hover:bg-gray-900"
              >
                <td className="px-4 py-3 text-xs">{sub.user_id}</td>

                <td className="px-4 py-3">
                  <StatusBadge status={sub.status} />
                </td>

                <td className="px-4 py-3">
                  {sub.trial_ends_at
                    ? new Date(sub.trial_ends_at).toLocaleDateString()
                    : "—"}
                </td>

                <td className="px-4 py-3">
                  {new Date(sub.created_at).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-xs text-gray-400">
                  {sub.stripe_subscription_id ?? "—"}
                </td>
              </tr>
            ))}

            {subs?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6">
                  No subscriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────────────────────── */
/* STATUS BADGE */
/* ───────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    trialing: "bg-yellow-500/20 text-yellow-400",
    active: "bg-green-500/20 text-green-400",
    past_due: "bg-red-500/20 text-red-400",
    canceled: "bg-gray-500/20 text-gray-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] ?? "bg-gray-700 text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

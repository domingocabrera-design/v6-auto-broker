import { requireAdmin } from "@/lib/requireAdmin";

type DepositRow = {
  user_id: string;
  available_amount: number;
  locked_amount: number;
  lock_expires_at: string | null;
  profiles:
    | { email: string }
    | { email: string }[];
};

export default async function AdminDepositsPage() {
  const { supabase } = await requireAdmin();

  const { data: deposits } = await supabase
    .from("deposits")
    .select(`
      user_id,
      available_amount,
      locked_amount,
      lock_expires_at,
      profiles:profiles!inner (
        email
      )
    `);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Deposits</h1>

      {(deposits as DepositRow[] | null)?.map((d) => {
        const email = Array.isArray(d.profiles)
          ? d.profiles[0]?.email
          : d.profiles?.email;

        return (
          <div key={d.user_id} className="border p-4 rounded mb-3">
            <div>{email ?? "—"}</div>
            <div>Available: ${d.available_amount}</div>
            <div>Locked: ${d.locked_amount}</div>
            <div>Lock expires: {d.lock_expires_at || "—"}</div>

            <form action="/admin/api/unlock-deposit" method="POST">
              <input type="hidden" name="userId" value={d.user_id} />
              <button className="mt-2 bg-blue-600 px-3 py-1 rounded">
                Unlock Deposit
              </button>
            </form>

            <form action="/admin/api/forfeit-deposit" method="POST">
              <input type="hidden" name="userId" value={d.user_id} />
              <button className="mt-2 bg-red-600 px-3 py-1 rounded">
                Forfeit Deposit
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}

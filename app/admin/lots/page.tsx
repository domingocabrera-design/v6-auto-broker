import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { isAdmin } from "@/lib/isAdmin";

type Lot = {
  id: string;
  url: string;
  created_at: string;
};

export default async function AdminLotsPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/login");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/admin/lots`,
    { cache: "no-store" }
  );

  const { lots } = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — Saved Lots</h1>

      {lots.length === 0 && (
        <p className="text-gray-500">No saved lots yet.</p>
      )}

      {lots.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-800">
            <thead className="bg-gray-900 text-gray-300">
              <tr>
                <th className="p-3 text-left">Lot ID</th>
                <th className="p-3 text-left">URL</th>
                <th className="p-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot: Lot) => (
                <tr key={lot.id} className="border-t border-gray-800">
                  <td className="p-3 font-mono text-xs">#{lot.id}</td>
                  <td className="p-3 truncate max-w-xs">
                    <a
                      href={lot.url}
                      target="_blank"
                      className="underline"
                      rel="noreferrer"
                    >
                      {lot.url}
                    </a>
                  </td>
                  <td className="p-3 text-xs text-gray-400">
                    {new Date(lot.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

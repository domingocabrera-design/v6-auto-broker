import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { isAdmin } from "@/lib/isAdmin";

type RequestLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  carRequest: string;
  budget: string;
  zip: string;
  created_at: string;
};

export default async function AdminRequestsPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/login");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/admin/requests`,
    { cache: "no-store" }
  );

  const { requests } = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — Buy Requests</h1>

      {requests.length === 0 && (
        <p className="text-gray-500">No buy requests yet.</p>
      )}

      {requests.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-800">
            <thead className="bg-gray-900 text-gray-300">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Budget / ZIP</th>
                <th className="p-3">Car Request</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: RequestLead) => (
                <tr key={r.id} className="border-t border-gray-800 align-top">
                  <td className="p-3 font-semibold">{r.name}</td>
                  <td className="p-3 text-xs">
                    <div>{r.phone}</div>
                    <div className="text-gray-400">{r.email}</div>
                  </td>
                  <td className="p-3 text-xs">
                    <div>{r.budget ? `$${r.budget}` : "—"}</div>
                    <div className="text-gray-400">{r.zip || "—"}</div>
                  </td>
                  <td className="p-3 text-xs whitespace-pre-wrap max-w-xs">
                    {r.carRequest}
                  </td>
                  <td className="p-3 text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleString()}
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

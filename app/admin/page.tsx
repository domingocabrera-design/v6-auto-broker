import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";

export default async function AdminUsersPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/dashboard");
  }

  // rest of the page...
}

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { isAdmin } from "@/lib/isAdmin";
import Link from "next/link";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/login");
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, email, created_at, is_frozen")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load users: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin — Users
      </h1>

      <div className="overflow-x-auto border border-gray-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#0d0d0d] text-gray-400">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3">Frozen</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-800 hover:bg-[#111]"
              >
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-center">
                  {u.is_frozen ? "❄️ Yes" : "—"}
                </td>
                <td className="p-3 text-xs text-gray-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="px-3 py-1 rounded border border-gray-600 text-xs font-semibold hover:bg-gray-800"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {users?.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 py-6"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

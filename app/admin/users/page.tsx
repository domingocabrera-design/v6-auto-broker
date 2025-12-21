import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

type AdminUser = {
  id: string;
  email: string;
  is_frozen: boolean | null;
  created_at: string;
};

export default async function AdminUsersPage() {
  const { data: users, error } = await supabaseAdmin
    .from("admin_users_view")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load users: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin — Users</h1>

      <div className="overflow-x-auto border border-gray-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#0d0d0d] text-gray-400">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Frozen</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users?.map((u: AdminUser) => (
              <tr
                key={u.id}
                className="border-t border-gray-800 hover:bg-[#111]"
              >
                <td className="p-3">{u.email}</td>

                <td className="p-3 text-center">
                  {u.is_frozen ? "❄️ Yes" : "—"}
                </td>

                <td className="p-3 text-center">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="px-4 py-2 bg-blue-600 rounded text-black font-bold hover:bg-blue-500"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {users?.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-500">
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

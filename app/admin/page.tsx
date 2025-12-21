import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function AdminUsersPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .limit(50);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Users</h1>
      <pre className="text-xs bg-black/40 p-4 rounded">
        {JSON.stringify(users, null, 2)}
      </pre>
    </div>
  );
}

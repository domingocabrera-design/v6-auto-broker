import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function AdminUsersPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .limit(10);

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

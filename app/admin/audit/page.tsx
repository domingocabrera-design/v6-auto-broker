import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { isAdmin } from "@/lib/isAdmin";

export default async function AdminAuditLogPage() {
  const supabaseAuth = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/login");
  }

  const { data: logs } = await supabaseAdmin
    .from("admin_audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="p-6 bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Audit Log</h1>

      <div className="space-y-3">
        {logs?.map((l) => (
          <div
            key={l.id}
            className="border border-gray-800 rounded p-4 text-sm bg-[#0f0f0f]"
          >
            <p>
              <strong>Action:</strong> {l.action}
            </p>
            <p>
              <strong>Entity:</strong> {l.entity}
            </p>
            <p>
              <strong>Admin:</strong> {l.admin_user_id}
            </p>
            <p>
              <strong>Target User:</strong> {l.target_user_id ?? "—"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(l.created_at).toLocaleString()}
            </p>

            {(l.before || l.after) && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-gray-400">
                  View changes
                </summary>
                <pre className="mt-2 bg-black p-2 rounded overflow-x-auto">
                  {JSON.stringify(
                    { before: l.before, after: l.after },
                    null,
                    2
                  )}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

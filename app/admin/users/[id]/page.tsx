import { supabaseAdmin } from "@/lib/supabase/admin";
import FreezeButton from "./freeze-button";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserProfile({ params }: PageProps) {
  // ✅ MUST await params
  const { id } = await params;

  const { data: user, error } = await supabaseAdmin
    .from("admin_users_view")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !user) {
    return (
      <div className="p-6 text-red-500">
        Failed to load user
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">{user.email}</h1>

      <p className="mb-4">
        Status: {user.is_frozen ? "❄️ Frozen" : "Active"}
      </p>

      <FreezeButton userId={id} frozen={user.is_frozen} />
    </div>
  );
}

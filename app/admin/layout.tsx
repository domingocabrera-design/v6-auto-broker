import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // ✅ DO NOT await cookies()
  const cookieStore = cookies();

  // ✅ Supabase expects an async function
  const supabase = createServerComponentClient({
    cookies: async () => cookieStore,
  });

  // 🔐 Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 🔐 Admin check
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/dashboard");

  return (
    <div className="bg-[#0b0b0d] text-white min-h-screen">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">V6 Admin Panel</h1>

          <nav className="flex gap-4 text-sm text-gray-400">
            <a href="/admin/users" className="hover:text-white">
              Users
            </a>
            <a href="/admin/subscriptions" className="hover:text-white">
              Subscriptions
            </a>
            <a href="/dashboard" className="hover:text-white">
              Exit
            </a>
          </nav>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}

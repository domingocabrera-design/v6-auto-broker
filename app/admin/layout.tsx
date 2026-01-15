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
  // ✅ cookies() is SYNC in Next.js 16
  const cookieStore = cookies();

  // ✅ Supabase expects a Promise
  const supabase = createServerComponentClient({
    cookies: () => Promise.resolve(cookieStore),
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
        <div className="max-w-7xl mx-auto flex justify-between">
          <h1 className="text-xl font-bold">V6 Admin Panel</h1>
          <nav className="flex gap-4 text-sm text-gray-400">
            <a href="/admin/users">Users</a>
            <a href="/admin/subscriptions">Subscriptions</a>
            <a href="/dashboard">Exit</a>
          </nav>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}

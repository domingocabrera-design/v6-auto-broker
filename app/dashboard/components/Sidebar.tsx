"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type SidebarProps = {
  isAdmin?: boolean;
};

const menuItems = [
  { label: "Dashboard", icon: "🏠", href: "/dashboard" },
  { label: "Live Lots", icon: "🚗", href: "/dashboard/live-lots" },
  { label: "Search", icon: "🔍", href: "/search" },
  { label: "My Bids", icon: "📜", href: "/dashboard/my-bids" },
  { label: "Deposits", icon: "💵", href: "/deposits" },
  { label: "Broker Fees", icon: "🧾", href: "/dashboard/broker-fees" },
  { label: "Calculator", icon: "🧮", href: "/profit-calculator" },
  { label: "Shipping", icon: "🚚", href: "/shipping" },
  { label: "Inbox", icon: "📨", href: "/inbox" },
  { label: "Profile", icon: "👤", href: "/profile" },
];

const adminItems = [
  { label: "Admin Panel", icon: "🛠️", href: "/admin" },
  { label: "Add Lots", icon: "➕", href: "/add-lots" },
  { label: "Import Images", icon: "📸", href: "/dashboard/upload" },
  { label: "Analytics", icon: "📈", href: "/analytics" },
];

export default function Sidebar({ isAdmin }: SidebarProps) {
  const supabase = createClientComponentClient();
  const pathname = usePathname();

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#0e0e0e] text-white border-r border-gray-800 p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">V6 Auto Broker</h1>

      {/* MAIN MENU */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`p-2 rounded-lg cursor-pointer transition ${
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}

        {/* ADMIN */}
        {isAdmin && (
          <>
            <div className="mt-6 text-gray-400 text-sm uppercase">Admin</div>

            {adminItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`p-2 rounded-lg cursor-pointer transition ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="p-2 bg-red-600 rounded-lg font-semibold hover:bg-red-700"
      >
        🚪 Logout
      </button>
    </div>
  );
}

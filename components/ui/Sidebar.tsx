"use client";

import { Home, BarChart2, Car, Wallet2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Lots", icon: Car, href: "/lots" },
    { name: "Analytics", icon: BarChart2, href: "/analytics" },
    { name: "Deposits", icon: Wallet2, href: "/deposits" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <aside
      className="
        fixed left-0 top-0 h-full w-64 
        bg-white border-r border-gray-200 
        shadow-xl z-20
      "
    >
      {/* LOGO AREA */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold">
          <span className="text-gray-900">V6 </span>
          <span className="text-blue-600">Auto Broker</span>
        </h1>
      </div>

      {/* MENU */}
      <nav className="mt-6 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-6 py-3 
                text-gray-700 font-medium transition
                hover:bg-blue-50

                ${active ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" : ""}
              `}
            >
              <item.icon
                size={20}
                className={`${active ? "text-blue-600" : "text-gray-500"}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

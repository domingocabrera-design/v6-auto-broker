"use client";

import { Menu, Bell, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header
      className="
        w-full h-20 bg-white 
        border-b border-gray-200 
        flex items-center justify-between 
        px-8 shadow-sm z-10
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <Menu className="text-gray-600" size={26} />
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          Dashboard
        </h2>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative hover:scale-110 transition">
          <Bell className="text-gray-600 hover:text-blue-600 transition" size={22} />
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <Image
            src="/goldv6.png" // replace with your avatar image
            width={34}
            height={34}
            alt="avatar"
            className="rounded-full object-cover shadow-md"
          />
          <p className="font-semibold text-gray-700">Mingo</p>
        </div>
      </div>
    </header>
  );
}

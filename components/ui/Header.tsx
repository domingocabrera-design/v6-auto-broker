"use client";

import { Menu, Bell } from "lucide-react";
import Image from "next/image";

export default function Header() {

  const flags = [
    "/usa.png",
    "/mx.png",
    "/do.png",
    "/gt.png",
    "/hn.png",
    "/ng.png",
    "/af.png",
  ];

  return (
    <header
      className="
        w-full 
        min-h-[90px]
        bg-black 
        border-b border-gray-800 
        flex items-center justify-between 
        px-8 shadow-md z-10
        overflow-visible
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Menu className="text-gray-300" size={26} />
        <h2 className="text-xl font-bold text-white tracking-tight">Dashboard</h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-10 overflow-visible">

        {/* FLAGS FIXED HEIGHT */}
        <div className="flex items-center gap-3 overflow-visible">
          {flags.map((src, i) => (
            <div key={i} className="w-[36px] h-[24px] flex overflow-visible">
              <Image
                src={src}
                width={36}
                height={24}
                alt={src}
                className="rounded border border-gray-700 overflow-visible"
              />
            </div>
          ))}
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative hover:scale-110 transition">
          <Bell className="text-gray-300 hover:text-blue-500 transition" size={22} />
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            3
          </span>
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-3 cursor-pointer">
          <Image
            src="/goldv6.png"
            width={34}
            height={34}
            alt="avatar"
            className="rounded-full object-cover shadow-md ring-2 ring-blue-500"
          />
          <p className="font-semibold text-white">Mingo</p>
        </div>

      </div>
    </header>
  );
}

"use client";

import { Inter } from "next/font/google";
import BidStatusListener from "@/components/BidStatusListener";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      {/* 🔥 Supabase realtime listener */}
      <BidStatusListener />

      {/* 🔥 Render all app pages */}
      {children}
    </div>
  );
}

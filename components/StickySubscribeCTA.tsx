"use client";

import Link from "next/link";

export default function StickySubscribeCTA({ lang }: { lang: string }) {
  return (
    <Link
      href={`/${lang}/pricing`}
      className="
        fixed bottom-6 right-6 z-50
        bg-blue-600 hover:bg-blue-500
        text-white font-extrabold
        px-6 py-4 rounded-2xl
        shadow-2xl animate-pulse
      "
    >
      Subscribe Today
    </Link>
  );
}

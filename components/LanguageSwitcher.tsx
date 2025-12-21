"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  function switchLang(lang: "en" | "es") {
    const newPath = pathname.replace(/^\/(en|es)/, `/${lang}`);
    router.push(newPath);
    localStorage.setItem("lang", lang);
  }

  return (
    <div className="flex gap-2 font-bold">
      <button onClick={() => switchLang("en")}>🇺🇸 EN</button>
      <button onClick={() => switchLang("es")}>🇪🇸 ES</button>
    </div>
  );
}

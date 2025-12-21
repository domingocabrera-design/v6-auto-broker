import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UsageBadge from "@/components/subscription/UsageBadge";

export default function EsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white">

        {/* ================= NAVBAR ================= */}
        <header className="w-full bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* LOGO */}
            <div className="flex items-center gap-3">
              <Image
                src="/v6-logo.png"
                width={50}
                height={50}
                alt="V6 Auto Broker"
              />
              <span className="text-xl font-extrabold">
                V6 Auto Broker
              </span>
            </div>

            {/* NAV LINKS + ACTIONS */}
            <nav className="flex items-center gap-6 text-sm font-semibold">

              <Link href="/es" className="hover:text-blue-400 transition">
                Inicio
              </Link>

              <Link href="/es/pricing" className="hover:text-blue-400 transition">
                Precios
              </Link>

              <Link href="/es/faq" className="hover:text-blue-400 transition">
                Preguntas
              </Link>

              <Link href="/es/contact" className="hover:text-blue-400 transition">
                Contacto
              </Link>

              {/* 🔐 LOGIN */}
              <Link
                href="/login"
                className="px-5 py-2 bg-blue-600 rounded-lg text-black font-bold hover:bg-blue-500 transition"
              >
                Iniciar sesión
              </Link>

              {/* 📊 PLAN USAGE BADGE */}
              <UsageBadge lang="es" />

              {/* 🌍 LANGUAGE SWITCH */}
              <LanguageSwitcher />

            </nav>

          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main>{children}</main>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-gray-800 py-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} V6 Auto Broker
          <br />
          Una marca comercial (DBA) de Empire Luxury Sales LLC
        </footer>

      </body>
    </html>
  );
}

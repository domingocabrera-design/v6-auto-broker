// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "V6 Auto Broker",
  description: "Buy from Copart without a dealer license",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      {/* ✅ BODY STYLE IS DEFINED ONCE — NO HYDRATION MISMATCH */}
      <body className="bg-[#0f0f11] text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "V6 Auto Broker",
  description: "Buy Cars Like a Dealer — Powered by V6 Auto Broker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0b0d] text-white min-h-screen">
        {/* Client-only providers / effects */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

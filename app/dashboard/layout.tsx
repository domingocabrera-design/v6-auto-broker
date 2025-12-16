import Header from "@/components/ui/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-6 px-6">
        {children}
      </main>
    </div>
  );
}

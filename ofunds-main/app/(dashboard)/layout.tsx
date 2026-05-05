import { Navbar } from "@/components/shared/navbar";
import { MobileNav } from "@/components/shared/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative pb-24 md:pb-0 pt-20">
      <Navbar />
      <main className="dashboard-container dashboard-main">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

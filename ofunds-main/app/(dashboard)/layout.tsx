import { Navbar } from "@/components/shared/navbar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { PushNotificationBanner } from "@/components/shared/push-notification-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background relative pb-24 md:pb-0 pt-20 overflow-x-hidden">
      <Navbar />
      <main className="dashboard-container dashboard-main">
        {children}
      </main>
      <MobileNav />
      <PushNotificationBanner />
    </div>
  );
}

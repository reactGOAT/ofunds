import type { Metadata } from "next";
import DashboardClient from "./client";

export const metadata: Metadata = {
  title: "Dashboard - Ofunds",
  description:
    "Manage your finances and transfers with Ofunds digital wallet",
};

export default function DashboardPage() {
  return <DashboardClient />;
}

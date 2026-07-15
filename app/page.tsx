import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StyleSync | Dashboard",
};

export default function HomePage() {
  return <DashboardClient />;
}

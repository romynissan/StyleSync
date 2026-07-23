import { AlertsPageClient } from "@/components/pages/alerts-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StyleSync | Alerts",
};

export default function AlertsPage() {
  return <AlertsPageClient />;
}

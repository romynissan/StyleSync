"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StockoutAlerts } from "@/components/dashboard/stockout-alerts";

export function AlertsPageClient() {
  return (
    <DashboardShell
      title="Alerts"
      subtitle="SKUs approaching stockout risk"
    >
      <StockoutAlerts limit={25} />
    </DashboardShell>
  );
}

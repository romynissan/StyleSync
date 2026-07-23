"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { WarehouseStatistics } from "@/components/dashboard/warehouse-statistics";

export function WarehousesPageClient() {
  return (
    <DashboardShell
      title="Warehouses"
      subtitle="Capacity utilization and inventory health by node"
    >
      <WarehouseStatistics />
    </DashboardShell>
  );
}

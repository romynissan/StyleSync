"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { InventoryTable } from "@/components/dashboard/inventory-table";

export function InventoryPageClient() {
  return (
    <DashboardShell
      title="Inventory"
      subtitle="On-hand position by SKU and warehouse"
    >
      <InventoryTable pageSize={25} />
    </DashboardShell>
  );
}

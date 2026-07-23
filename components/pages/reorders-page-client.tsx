"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RecentReorders } from "@/components/dashboard/recent-reorders";

export function ReordersPageClient() {
  return (
    <DashboardShell
      title="Reorders"
      subtitle="Recommended replenishment actions"
    >
      <RecentReorders limit={25} />
    </DashboardShell>
  );
}

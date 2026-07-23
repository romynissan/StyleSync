"use client";

import { DashboardShell } from "./dashboard-shell";
import { DemandForecastChart } from "./demand-forecast-chart";
import { InventoryTable } from "./inventory-table";
import { KpiCards } from "./kpi-cards";
import { RecentReorders } from "./recent-reorders";
import { StockoutAlerts } from "./stockout-alerts";
import {
  SyncPredictionsButton,
  SyncPredictionsStatus,
  useSyncPredictions,
} from "./sync-predictions-button";
import { TrendHeatmap } from "./trend-heatmap";
import { WarehouseStatistics } from "./warehouse-statistics";

export function DashboardClient() {
  const syncMutation = useSyncPredictions();

  return (
    <DashboardShell
      actions={<SyncPredictionsButton syncMutation={syncMutation} />}
    >
      <SyncPredictionsStatus syncMutation={syncMutation} />

      <div className="space-y-6">
        <KpiCards />

        <div className="grid gap-6 xl:grid-cols-2">
          <DemandForecastChart />
          <TrendHeatmap />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <StockoutAlerts />
          <RecentReorders />
        </div>

        <InventoryTable />
        <WarehouseStatistics />
      </div>
    </DashboardShell>
  );
}

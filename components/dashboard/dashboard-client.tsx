"use client";

import { Button } from "@/components/ui";
import { dashboardKeys } from "@/lib/hooks/use-dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { DashboardShell } from "./dashboard-shell";
import { DemandForecastChart } from "./demand-forecast-chart";
import { InventoryTable } from "./inventory-table";
import { KpiCards } from "./kpi-cards";
import { RecentReorders } from "./recent-reorders";
import { StockoutAlerts } from "./stockout-alerts";
import { TrendHeatmap } from "./trend-heatmap";
import { WarehouseStatistics } from "./warehouse-statistics";

async function syncPredictions(): Promise<{ productsUpdated: number }> {
  const response = await fetch("/api/predictions/sync", { method: "POST" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? "Sync failed");
  }
  const json = await response.json();
  return json.data;
}

export function DashboardClient() {
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: syncPredictions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });

  return (
    <DashboardShell
      actions={
        <Button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          {syncMutation.isPending ? "Running AI…" : "Sync AI predictions"}
        </Button>
      }
    >
      {syncMutation.isError && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-status-danger/20 bg-status-danger-muted px-4 py-3 text-body text-status-danger"
        >
          {syncMutation.error.message}
        </div>
      )}
      {syncMutation.isSuccess && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-status-success/20 bg-status-success-muted px-4 py-3 text-body text-status-success"
        >
          AI predictions synced ({syncMutation.data.productsUpdated} products).
        </div>
      )}

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

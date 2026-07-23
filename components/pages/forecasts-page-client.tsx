"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DemandForecastChart } from "@/components/dashboard/demand-forecast-chart";
import {
  SyncPredictionsButton,
  SyncPredictionsStatus,
  useSyncPredictions,
} from "@/components/dashboard/sync-predictions-button";
import { TrendHeatmap } from "@/components/dashboard/trend-heatmap";

export function ForecastsPageClient() {
  const syncMutation = useSyncPredictions();

  return (
    <DashboardShell
      title="Forecasts"
      subtitle="Demand predictions and trend momentum"
      actions={<SyncPredictionsButton syncMutation={syncMutation} />}
    >
      <SyncPredictionsStatus syncMutation={syncMutation} />

      <div className="grid gap-6 xl:grid-cols-2">
        <DemandForecastChart />
        <TrendHeatmap />
      </div>
    </DashboardShell>
  );
}

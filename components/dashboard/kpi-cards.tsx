"use client";

import { Card, CardContent, Stat } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useDashboardSummary } from "@/lib/hooks/use-dashboard";
import {
  AlertTriangle,
  Boxes,
  LineChart,
  RefreshCw,
} from "lucide-react";

export function KpiCards() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="text-body text-status-danger">
          Unable to load KPI summary. Check database connection and API routes.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="hover:shadow-elevated">
        <CardContent>
          <Stat
            label="Total SKUs"
            value={formatNumber(data.totalSkus)}
            delta={`${formatNumber(data.totalUnits)} units on hand`}
            deltaVariant="neutral"
            icon={<Boxes className="h-4 w-4" strokeWidth={1.75} />}
          />
        </CardContent>
      </Card>
      <Card className="hover:shadow-elevated">
        <CardContent>
          <Stat
            label="Stockout alerts"
            value={formatNumber(data.stockoutAlertCount)}
            delta={`${data.criticalAlertCount} critical`}
            deltaVariant={data.criticalAlertCount > 0 ? "negative" : "positive"}
            icon={<AlertTriangle className="h-4 w-4" strokeWidth={1.75} />}
          />
        </CardContent>
      </Card>
      <Card className="hover:shadow-elevated">
        <CardContent>
          <Stat
            label="30-day forecast"
            value={formatCurrency(data.forecastRevenue30d)}
            delta={`Trend score ${data.avgTrendScore}`}
            deltaVariant="positive"
            icon={<LineChart className="h-4 w-4" strokeWidth={1.75} />}
          />
        </CardContent>
      </Card>
      <Card className="hover:shadow-elevated">
        <CardContent>
          <Stat
            label="Pending reorders"
            value={formatNumber(data.pendingReorderCount)}
            delta={`${data.warehouseCount} warehouses`}
            deltaVariant="warning"
            icon={<RefreshCw className="h-4 w-4" strokeWidth={1.75} />}
          />
        </CardContent>
      </Card>
    </div>
  );
}

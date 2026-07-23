"use client";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";
import { useStockoutAlerts } from "@/lib/hooks/use-dashboard";
import type { StockoutRiskLevel } from "@/types/domain";
import { AlertTriangle } from "lucide-react";

const riskVariant: Record<
  StockoutRiskLevel,
  "danger" | "warning" | "default"
> = {
  critical: "danger",
  medium: "warning",
  low: "default",
  none: "default",
};

export function StockoutAlerts() {
  const { data, isLoading, isError } = useStockoutAlerts();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle
            className="h-4 w-4 text-status-warning"
            strokeWidth={1.75}
          />
          <CardTitle>Stockout alerts</CardTitle>
        </div>
        <CardDescription>SKUs approaching lead-time risk</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))
        ) : isError ? (
          <p className="text-body text-status-danger">Failed to load alerts.</p>
        ) : data?.length === 0 ? (
          <p className="text-body text-ink-muted">No active stockout risks.</p>
        ) : (
          data?.map((alert) => (
            <div
              key={alert.inventoryId}
              className="flex items-start justify-between gap-3 rounded-xl border border-border-subtle bg-canvas/70 px-3.5 py-3 transition-soft hover:bg-canvas"
            >
              <div className="min-w-0">
                <p className="truncate text-body font-semibold text-ink">
                  {alert.product.name}
                </p>
              
                <p className="text-caption text-ink-muted">
                  SKU: {alert.product.sku}
                </p>
              
                <p className="text-caption text-ink-muted">
                  {alert.warehouse.code} · {formatNumber(alert.quantity)} units ·{" "}
                  {alert.daysOfSupply ?? "—"}d supply
                </p>
              </div>
              <Badge variant={riskVariant[alert.riskLevel]}>
                {alert.riskLevel}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

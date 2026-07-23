"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatPercent } from "@/lib/format";
import { useWarehouses } from "@/lib/hooks/use-dashboard";

export function WarehouseStatistics() {
  const { data, isLoading, isError } = useWarehouses();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse statistics</CardTitle>
        <CardDescription>
          Capacity utilization and inventory health by node
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {isLoading ? (
          <div className="space-y-3 px-6 py-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="px-6 py-5 text-body text-status-danger">
            Failed to load warehouses.
          </p>
        ) : (
          <table className="w-full min-w-[560px] text-left text-body">
            <thead className="border-b border-border-subtle bg-canvas/60 text-caption uppercase tracking-[0.05em] text-ink-faint">
              <tr>
                <th className="px-6 py-3.5 font-medium">Warehouse</th>
                <th className="px-6 py-3.5 text-right font-medium">SKUs</th>
                <th className="px-6 py-3.5 text-right font-medium">Units</th>
                <th className="px-6 py-3.5 text-right font-medium">
                  Utilization
                </th>
                <th className="px-6 py-3.5 text-right font-medium">Low stock</th>
                <th className="px-6 py-3.5 text-right font-medium">Critical</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((wh) => (
                <tr
                  key={wh.id}
                  className="border-b border-border-subtle/70 transition-soft last:border-0 hover:bg-canvas/50"
                >
                  <td className="px-6 py-3.5">
                    <div className="font-semibold text-ink">
                      {wh.city}, {wh.region}
                    </div>
                    <div className="text-caption text-ink-muted">
                      Warehouse: {wh.code}
                    </div>
                  </td>
                  <td className="tabular-nums px-6 py-3.5 text-right text-ink">
                    {formatNumber(wh.totalSkus)}
                  </td>
                  <td className="tabular-nums px-6 py-3.5 text-right text-ink">
                    {formatNumber(wh.totalUnits)}
                  </td>
                  <td className="tabular-nums px-6 py-3.5 text-right text-ink">
                    {formatPercent(wh.utilizationPercent)}
                  </td>
                  <td className="tabular-nums px-6 py-3.5 text-right text-status-warning">
                    {wh.lowStockCount}
                  </td>
                  <td className="tabular-nums px-6 py-3.5 text-right text-status-danger">
                    {wh.criticalStockCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

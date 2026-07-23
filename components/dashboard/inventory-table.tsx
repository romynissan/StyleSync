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
import { useInventory } from "@/lib/hooks/use-dashboard";
import type { StockoutRiskLevel } from "@/types/domain";

const riskVariant: Record<
  StockoutRiskLevel,
  "success" | "warning" | "danger" | "default"
> = {
  none: "success",
  low: "default",
  medium: "warning",
  critical: "danger",
};

interface InventoryTableProps {
  page?: number;
  pageSize?: number;
}

export function InventoryTable({ page = 1, pageSize = 8 }: InventoryTableProps) {
  const { data, isLoading, isError } = useInventory(page, pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory overview</CardTitle>
        <CardDescription>
          On-hand position by SKU and warehouse
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {isLoading ? (
          <div className="space-y-3 px-6 py-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="px-6 py-5 text-body text-status-danger">
            Failed to load inventory.
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-body">
            <thead className="border-b border-border-subtle bg-canvas/60 text-caption uppercase tracking-[0.05em] text-ink-faint">
              <tr>
                <th className="px-6 py-3.5 font-medium">SKU</th>
                <th className="px-6 py-3.5 font-medium">Warehouse</th>
                <th className="px-6 py-3.5 text-right font-medium">Qty</th>
                <th className="px-6 py-3.5 text-right font-medium">Safety</th>
                <th className="px-6 py-3.5 text-right font-medium">
                  Days supply
                </th>
                <th className="px-6 py-3.5 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border-subtle/70 transition-soft last:border-0 hover:bg-canvas/50"
                >
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-ink">
                        {row.product.name}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-ink-muted">
                        SKU: {row.product.sku}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-ink-muted">
                    {row.warehouse.code}
                  </td>
                  <td className="tabular-nums px-6 py-3.5 text-right text-ink">
                    {formatNumber(row.quantity)}
                  </td>
                  <td className="tabular-nums px-6 py-3.5 text-right text-ink-muted">
                    {formatNumber(row.safetyStock)}
                  </td>
                  <td className="tabular-nums px-6 py-3.5 text-right text-ink">
                    {row.daysOfSupply ?? "—"}
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge variant={riskVariant[row.stockoutRisk]}>
                      {row.stockoutRisk}
                    </Badge>
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

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
import { formatDate, formatNumber } from "@/lib/format";
import { useReorders } from "@/lib/hooks/use-dashboard";
import { RefreshCw } from "lucide-react";

const statusVariant: Record<string, "default" | "brand" | "success" | "info"> =
  {
    PENDING: "default",
    APPROVED: "brand",
    ORDERED: "info",
    RECEIVED: "success",
    CANCELLED: "default",
  };

const priorityVariant: Record<string, "danger" | "warning" | "default"> = {
  CRITICAL: "danger",
  HIGH: "warning",
  NORMAL: "default",
  LOW: "default",
};

export function RecentReorders() {
  const { data, isLoading, isError } = useReorders();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
          <CardTitle>Recent reorders</CardTitle>
        </div>
        <CardDescription>Recommended replenishment actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))
        ) : isError ? (
          <p className="text-body text-status-danger">
            Failed to load reorders.
          </p>
        ) : (
          data?.map((reorder) => (
            <div
              key={reorder.id}
              className="rounded-xl border border-border-subtle bg-canvas/70 px-3.5 py-3 transition-soft hover:bg-canvas"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-body font-medium text-ink">
                  {reorder.product.sku}
                </p>
                <div className="flex gap-1.5">
                  <Badge
                    variant={priorityVariant[reorder.priority] ?? "default"}
                  >
                    {reorder.priority}
                  </Badge>
                  <Badge variant={statusVariant[reorder.status] ?? "default"}>
                    {reorder.status}
                  </Badge>
                </div>
              </div>
              <p className="mt-1 text-caption text-ink-muted">
                {reorder.warehouse.code} · {formatNumber(reorder.quantity)}{" "}
                units · {formatDate(reorder.recommendedAt)}
              </p>
              {reorder.notes && (
                <p className="mt-1.5 text-caption text-ink-muted">
                  {reorder.notes}
                </p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

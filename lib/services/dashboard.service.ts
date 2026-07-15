import { unstable_cache } from "next/cache";
import { countStockoutAlerts } from "@/lib/services/alert.service";
import { countPendingReorders } from "@/lib/services/reorder.service";
import { getAverageTrendScore } from "@/lib/services/trend.service";
import { CACHE_TTL_SECONDS, cacheTags } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { DashboardSummary } from "@/types/domain";

async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const today = new Date();
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 30);

  const [
    skuCount,
    inventoryAgg,
    warehouseCount,
    alertCounts,
    pendingReorders,
    avgTrendScore,
    forecastAgg,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.inventoryItem.aggregate({ _sum: { quantity: true } }),
    prisma.warehouse.count(),
    countStockoutAlerts(),
    countPendingReorders(),
    getAverageTrendScore(),
    prisma.prediction.findMany({
      where: { forecastDate: { gte: today, lte: horizon } },
      select: {
        predictedDemand: true,
        product: { select: { retailPrice: true } },
      },
    }),
  ]);

  const forecastRevenue30d = forecastAgg.reduce(
    (sum, row) =>
      sum + row.predictedDemand * Number(row.product.retailPrice),
    0,
  );

  return {
    totalSkus: skuCount,
    totalUnits: inventoryAgg._sum.quantity ?? 0,
    warehouseCount,
    stockoutAlertCount: alertCounts.total,
    criticalAlertCount: alertCounts.critical,
    pendingReorderCount: pendingReorders,
    avgTrendScore,
    forecastRevenue30d: Math.round(forecastRevenue30d),
  };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return getCachedDashboardSummary();
}

const getCachedDashboardSummary = unstable_cache(
  fetchDashboardSummary,
  ["dashboard-summary"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [cacheTags.dashboard],
  },
);

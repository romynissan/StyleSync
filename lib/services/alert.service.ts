import {
  calculateDaysOfSupply,
  calculateStockoutRisk,
  toProductSummary,
  toWarehouseSummary,
} from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { StockoutAlert, StockoutRiskLevel } from "@/types/domain";

export interface StockoutAlertQuery {
  minRisk?: StockoutRiskLevel;
  warehouseId?: string;
  limit?: number;
}

const riskOrder: Record<StockoutRiskLevel, number> = {
  critical: 4,
  medium: 3,
  low: 2,
  none: 1,
};

export async function getStockoutAlerts(
  query: StockoutAlertQuery = {},
): Promise<StockoutAlert[]> {
  const limit = Math.min(100, Math.max(1, query.limit ?? 25));
  const minRisk = query.minRisk ?? "low";

  const inventory = await prisma.inventoryItem.findMany({
    where: query.warehouseId ? { warehouseId: query.warehouseId } : undefined,
    include: { product: true, warehouse: true },
  });

  const productIds = inventory.map((i) => i.productId);
  const demandMap = await getPredictedDemand30d(productIds);

  const alerts: StockoutAlert[] = [];

  for (const item of inventory) {
    const predictedDemand30d = demandMap.get(item.productId) ?? 0;
    const riskLevel = calculateStockoutRisk(
      item.quantity,
      item.safetyStock,
      predictedDemand30d,
      item.leadTimeDays,
    );

    if (riskOrder[riskLevel] < riskOrder[minRisk]) continue;

    alerts.push({
      inventoryId: item.id,
      riskLevel,
      quantity: item.quantity,
      safetyStock: item.safetyStock,
      daysOfSupply: calculateDaysOfSupply(item.quantity, predictedDemand30d),
      predictedDemand30d,
      product: toProductSummary(item.product),
      warehouse: toWarehouseSummary(item.warehouse),
    });
  }

  return alerts
    .sort((a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel])
    .slice(0, limit);
}

async function getPredictedDemand30d(
  productIds: string[],
): Promise<Map<string, number>> {
  if (productIds.length === 0) return new Map();

  const today = new Date();
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 30);

  const rows = await prisma.prediction.groupBy({
    by: ["productId"],
    where: {
      productId: { in: productIds },
      forecastDate: { gte: today, lte: horizon },
    },
    _sum: { predictedDemand: true },
  });

  return new Map(rows.map((r) => [r.productId, r._sum.predictedDemand ?? 0]));
}

export async function countStockoutAlerts(): Promise<{
  total: number;
  critical: number;
}> {
  const alerts = await getStockoutAlerts({ minRisk: "low", limit: 1000 });
  return {
    total: alerts.length,
    critical: alerts.filter((a) => a.riskLevel === "critical").length,
  };
}

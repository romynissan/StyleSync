import {
  calculateDaysOfSupply,
  calculateStockoutRisk,
  toProductSummary,
  toWarehouseSummary,
} from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { InventoryOverviewItem } from "@/types/domain";

export interface InventoryQuery {
  warehouseId?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export async function getInventoryOverview(
  query: InventoryQuery = {},
): Promise<{ items: InventoryOverviewItem[]; total: number }> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));
  const skip = (page - 1) * pageSize;

  const where = {
    ...(query.warehouseId ? { warehouseId: query.warehouseId } : {}),
    ...(query.category
      ? { product: { category: query.category } }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.inventoryItem.findMany({
      where,
      include: { product: true, warehouse: true },
      orderBy: [{ quantity: "asc" }, { product: { sku: "asc" } }],
      skip,
      take: pageSize,
    }),
    prisma.inventoryItem.count({ where }),
  ]);

  const productIds = rows.map((r) => r.productId);
  const demandByProduct = await getPredictedDemand30dByProduct(productIds);

  const items: InventoryOverviewItem[] = rows.map((row) => {
    const predictedDemand30d = demandByProduct.get(row.productId) ?? 0;
    const daysOfSupply = calculateDaysOfSupply(row.quantity, predictedDemand30d);
    const stockoutRisk = calculateStockoutRisk(
      row.quantity,
      row.safetyStock,
      predictedDemand30d,
      row.leadTimeDays,
    );

    return {
      id: row.id,
      quantity: row.quantity,
      safetyStock: row.safetyStock,
      leadTimeDays: row.leadTimeDays,
      daysOfSupply,
      stockoutRisk,
      product: toProductSummary(row.product),
      warehouse: toWarehouseSummary(row.warehouse),
    };
  });

  return { items, total };
}

async function getPredictedDemand30dByProduct(
  productIds: string[],
): Promise<Map<string, number>> {
  if (productIds.length === 0) return new Map();

  const today = new Date();
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 30);

  const predictions = await prisma.prediction.groupBy({
    by: ["productId"],
    where: {
      productId: { in: productIds },
      forecastDate: { gte: today, lte: horizon },
    },
    _sum: { predictedDemand: true },
  });

  return new Map(
    predictions.map((p) => [p.productId, p._sum.predictedDemand ?? 0]),
  );
}

export async function getDistinctCategories(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}

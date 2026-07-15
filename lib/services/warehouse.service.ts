import { toWarehouseSummary } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { WarehouseStats } from "@/types/domain";

export async function getWarehouseStatistics(): Promise<WarehouseStats[]> {
  const warehouses = await prisma.warehouse.findMany({
    include: {
      inventory: {
        include: { product: true },
      },
    },
    orderBy: { code: "asc" },
  });

  const productIds = [
    ...new Set(
      warehouses.flatMap((w) => w.inventory.map((i) => i.productId)),
    ),
  ];

  const demandMap = await getPredictedDemand30d(productIds);

  return warehouses.map((warehouse) => {
    const totalUnits = warehouse.inventory.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalSkus = warehouse.inventory.length;

    let lowStockCount = 0;
    let criticalStockCount = 0;

    for (const item of warehouse.inventory) {
      const demand = demandMap.get(item.productId) ?? 0;
      const leadTimeDemand = Math.ceil((demand / 30) * item.leadTimeDays);

      if (item.quantity <= item.safetyStock || item.quantity < leadTimeDemand) {
        criticalStockCount += 1;
      } else if (item.quantity <= item.safetyStock * 2) {
        lowStockCount += 1;
      }
    }

    const utilizationPercent =
      warehouse.capacity > 0
        ? Math.round((totalUnits / warehouse.capacity) * 1000) / 10
        : 0;

    return {
      ...toWarehouseSummary(warehouse),
      totalSkus,
      totalUnits,
      utilizationPercent,
      lowStockCount,
      criticalStockCount,
    };
  });
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

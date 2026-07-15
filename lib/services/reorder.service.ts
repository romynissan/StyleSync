import { toProductSummary, toWarehouseSummary } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { ReorderRecord } from "@/types/domain";

export interface ReorderQuery {
  status?: string;
  warehouseId?: string;
  limit?: number;
}

export async function getRecentReorders(
  query: ReorderQuery = {},
): Promise<ReorderRecord[]> {
  const limit = Math.min(50, Math.max(1, query.limit ?? 10));

  const rows = await prisma.reorder.findMany({
    where: {
      ...(query.warehouseId ? { warehouseId: query.warehouseId } : {}),
      ...(query.status
        ? { status: query.status as "PENDING" | "APPROVED" | "ORDERED" | "RECEIVED" | "CANCELLED" }
        : {}),
    },
    include: { product: true, warehouse: true },
    orderBy: { recommendedAt: "desc" },
    take: limit,
  });

  return rows.map((row) => ({
    id: row.id,
    quantity: row.quantity,
    status: row.status,
    priority: row.priority,
    recommendedAt: row.recommendedAt.toISOString(),
    notes: row.notes,
    product: toProductSummary(row.product),
    warehouse: toWarehouseSummary(row.warehouse),
  }));
}

export async function countPendingReorders(): Promise<number> {
  return prisma.reorder.count({
    where: { status: "PENDING" },
  });
}

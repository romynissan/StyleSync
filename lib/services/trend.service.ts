import { startOfWeek, toISODate } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { TrendHeatmapCell } from "@/types/domain";

export interface TrendQuery {
  weeks?: number;
  category?: string;
}

export async function getTrendHeatmap(
  query: TrendQuery = {},
): Promise<TrendHeatmapCell[]> {
  const weeks = Math.min(12, Math.max(4, query.weeks ?? 8));
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);

  const trendRows = await prisma.trendData.findMany({
    where: {
      recordedAt: { gte: since },
      ...(query.category
        ? { product: { category: query.category } }
        : {}),
    },
    include: { product: { select: { category: true } } },
    orderBy: { recordedAt: "asc" },
  });

  const buckets = new Map<
    string,
    { total: number; count: number; category: string; weekStart: string }
  >();

  for (const row of trendRows) {
    const week = toISODate(startOfWeek(row.recordedAt));
    const key = `${row.product.category}|${week}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.total += row.trendScore;
      existing.count += 1;
    } else {
      buckets.set(key, {
        category: row.product.category,
        weekStart: week,
        total: row.trendScore,
        count: 1,
      });
    }
  }

  return [...buckets.values()]
    .map((b) => ({
      category: b.category,
      weekStart: b.weekStart,
      avgTrendScore: Math.round((b.total / b.count) * 100) / 100,
      sampleSize: b.count,
    }))
    .sort((a, b) =>
      a.category === b.category
        ? a.weekStart.localeCompare(b.weekStart)
        : a.category.localeCompare(b.category),
    );
}

export async function getAverageTrendScore(): Promise<number> {
  const result = await prisma.trendData.aggregate({
    _avg: { trendScore: true },
    where: {
      recordedAt: { gte: daysAgo(30) },
    },
  });
  return Math.round((result._avg.trendScore ?? 0) * 100) / 100;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

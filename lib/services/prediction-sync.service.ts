import { readFile } from "node:fs/promises";
import path from "node:path";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

interface AiPredictionExport {
  generated_at: string;
  horizon_days: number;
  products: {
    sku: string;
    category: string;
    series: {
      date: string;
      predicted_demand: number;
      confidence: number;
    }[];
  }[];
}

const PREDICTIONS_PATH = path.join(
  process.cwd(),
  "ai-engine",
  "output",
  "predictions.json",
);

export async function syncPredictionsFromAi(): Promise<{
  productsUpdated: number;
  predictionsUpserted: number;
}> {
  const raw = await readFile(PREDICTIONS_PATH, "utf-8");
  const payload = JSON.parse(raw) as AiPredictionExport;

  const products = await prisma.product.findMany({
    select: { id: true, sku: true },
  });

  const skuToId = new Map(products.map((p) => [p.sku, p.id]));

  let productsUpdated = 0;
  let predictionsUpserted = 0;

  // Refresh prediction data
  for (const item of payload.products) {
    const productId = skuToId.get(item.sku);
    if (!productId) continue;

    productsUpdated += 1;

    for (let i = 0; i < item.series.length; i++) {
      const point = item.series[i];

      const now = new Date();
      const forecastDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + i,
        ),
      );

      await prisma.prediction.upsert({
        where: {
          productId_forecastDate: {
            productId,
            forecastDate,
          },
        },
        create: {
          productId,
          forecastDate,
          predictedDemand: point.predicted_demand,
          confidence: point.confidence,
          horizonDays: payload.horizon_days,
        },
        update: {
          predictedDemand: point.predicted_demand,
          confidence: point.confidence,
          horizonDays: payload.horizon_days,
          generatedAt: new Date(),
        },
      });

      predictionsUpserted += 1;
    }
  }

  // Refresh trend data dates so existing demo trend scores
  // fall within the dashboard's current 8-week window.
  const trendRows = await prisma.trendData.findMany({
    orderBy: { recordedAt: "asc" },
  });

  if (trendRows.length > 0) {
    const oldestDate = trendRows[0].recordedAt;
    const now = new Date();

    for (const trend of trendRows) {
      const daysFromOldest = Math.floor(
        (trend.recordedAt.getTime() - oldestDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const newDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 56 + daysFromOldest,
        ),
      );

      await prisma.trendData.update({
        where: { id: trend.id },
        data: {
          recordedAt: newDate,
        },
      });
    }
  }

  revalidateTag("dashboard");
  revalidateTag("predictions");
  revalidateTag("inventory");

  return {
    productsUpdated,
    predictionsUpserted,
  };
}

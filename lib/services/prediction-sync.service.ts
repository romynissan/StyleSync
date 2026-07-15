import { readFile } from "node:fs/promises";
import path from "node:path";
import { revalidateTag } from "next/cache";
import { runAiPipeline } from "@/lib/ai/runner";
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
  await runAiPipeline();

  const raw = await readFile(PREDICTIONS_PATH, "utf-8");
  const payload = JSON.parse(raw) as AiPredictionExport;

  const products = await prisma.product.findMany({
    select: { id: true, sku: true },
  });
  const skuToId = new Map(products.map((p) => [p.sku, p.id]));

  let productsUpdated = 0;
  let predictionsUpserted = 0;

  for (const item of payload.products) {
    const productId = skuToId.get(item.sku);
    if (!productId) continue;

    productsUpdated += 1;

    for (const point of item.series) {
      const forecastDate = new Date(point.date);
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

  revalidateTag("dashboard");
  revalidateTag("predictions");
  revalidateTag("inventory");

  return { productsUpdated, predictionsUpserted };
}

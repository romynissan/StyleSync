import { toISODate, toProductSummary } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import type { ProductForecast } from "@/types/domain";

export interface PredictionQuery {
  productId?: string;
  category?: string;
  horizonDays?: number;
  limit?: number;
}

export async function getDemandForecasts(
  query: PredictionQuery = {},
): Promise<ProductForecast[]> {
  const horizonDays = Math.min(30, Math.max(7, query.horizonDays ?? 30));
  const limit = Math.min(50, Math.max(1, query.limit ?? 10));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setDate(end.getDate() + horizonDays);

  const products = await prisma.product.findMany({
    where: {
      ...(query.productId ? { id: query.productId } : {}),
      ...(query.category ? { category: query.category } : {}),
    },
    take: limit,
    orderBy: { sku: "asc" },
    include: {
      predictions: {
        where: { forecastDate: { gte: today, lte: end } },
        orderBy: { forecastDate: "asc" },
      },
    },
  });

  return products
    .filter((p) => p.predictions.length > 0)
    .map((product) => {
      const series = product.predictions.map((p) => ({
        date: toISODate(p.forecastDate),
        predictedDemand: p.predictedDemand,
        confidence: p.confidence,
      }));

      const totalPredictedDemand = series.reduce(
        (sum, point) => sum + point.predictedDemand,
        0,
      );
      const avgConfidence =
        series.length > 0
          ? Math.round(
              (series.reduce((sum, p) => sum + p.confidence, 0) /
                series.length) *
                1000,
            ) / 1000
          : 0;

      return {
        product: toProductSummary(product),
        horizonDays,
        totalPredictedDemand,
        avgConfidence,
        series,
      };
    });
}

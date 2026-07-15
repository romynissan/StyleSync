import type { Product } from "@prisma/client";
import type {
  ProductSummary,
  StockoutRiskLevel,
  WarehouseSummary,
} from "@/types/domain";

export function toProductSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    size: product.size,
    color: product.color,
    style: product.style,
    material: product.material,
    cost: Number(product.cost),
    retailPrice: Number(product.retailPrice),
  };
}

export function toWarehouseSummary(warehouse: {
  id: string;
  code: string;
  name: string;
  city: string;
  region: string;
  country: string;
  capacity: number;
}): WarehouseSummary {
  return {
    id: warehouse.id,
    code: warehouse.code,
    name: warehouse.name,
    city: warehouse.city,
    region: warehouse.region,
    country: warehouse.country,
    capacity: warehouse.capacity,
  };
}

export function calculateDaysOfSupply(
  quantity: number,
  predictedDemand30d: number,
): number | null {
  if (predictedDemand30d <= 0) return null;
  const dailyDemand = predictedDemand30d / 30;
  return Math.round((quantity / dailyDemand) * 10) / 10;
}

export function calculateStockoutRisk(
  quantity: number,
  safetyStock: number,
  predictedDemand30d: number,
  leadTimeDays: number,
): StockoutRiskLevel {
  const leadTimeDemand = Math.ceil((predictedDemand30d / 30) * leadTimeDays);

  if (quantity <= 0 || quantity < leadTimeDemand) return "critical";
  if (quantity <= safetyStock) return "critical";
  if (quantity <= safetyStock * 1.5 || quantity <= leadTimeDemand * 1.25) {
    return "medium";
  }
  if (quantity <= safetyStock * 2) return "low";
  return "none";
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

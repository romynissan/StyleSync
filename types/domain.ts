export type StockoutRiskLevel = "none" | "low" | "medium" | "critical";

export interface ProductSummary {
  id: string;
  sku: string;
  name: string;
  category: string;
  size: string;
  color: string;
  style: string;
  material: string;
  cost: number;
  retailPrice: number;
}

export interface WarehouseSummary {
  id: string;
  code: string;
  name: string;
  city: string;
  region: string;
  country: string;
  capacity: number;
}

export interface InventoryOverviewItem {
  id: string;
  quantity: number;
  safetyStock: number;
  leadTimeDays: number;
  daysOfSupply: number | null;
  stockoutRisk: StockoutRiskLevel;
  product: ProductSummary;
  warehouse: WarehouseSummary;
}

export interface WarehouseStats extends WarehouseSummary {
  totalSkus: number;
  totalUnits: number;
  utilizationPercent: number;
  lowStockCount: number;
  criticalStockCount: number;
}

export interface TrendHeatmapCell {
  category: string;
  weekStart: string;
  avgTrendScore: number;
  sampleSize: number;
}

export interface DemandForecastPoint {
  date: string;
  predictedDemand: number;
  confidence: number;
}

export interface ProductForecast {
  product: ProductSummary;
  horizonDays: number;
  totalPredictedDemand: number;
  avgConfidence: number;
  series: DemandForecastPoint[];
}

export interface StockoutAlert {
  inventoryId: string;
  riskLevel: StockoutRiskLevel;
  quantity: number;
  safetyStock: number;
  daysOfSupply: number | null;
  predictedDemand30d: number;
  product: ProductSummary;
  warehouse: WarehouseSummary;
}

export interface ReorderRecord {
  id: string;
  quantity: number;
  status: string;
  priority: string;
  recommendedAt: string;
  notes: string | null;
  product: ProductSummary;
  warehouse: WarehouseSummary;
}

export interface DashboardSummary {
  totalSkus: number;
  totalUnits: number;
  warehouseCount: number;
  stockoutAlertCount: number;
  criticalAlertCount: number;
  pendingReorderCount: number;
  avgTrendScore: number;
  forecastRevenue30d: number;
}

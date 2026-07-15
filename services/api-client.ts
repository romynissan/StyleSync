import type {
  DashboardSummary,
  DemandForecastPoint,
  InventoryOverviewItem,
  ProductForecast,
  ReorderRecord,
  StockoutAlert,
  TrendHeatmapCell,
  WarehouseStats,
} from "@/types/domain";
import type { ApiResponse } from "@/types";

const API_BASE = "/api";

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return fetchApi<DashboardSummary>("/dashboard/summary");
}

export function getInventory(params?: {
  page?: number;
  pageSize?: number;
  warehouseId?: string;
  category?: string;
}): Promise<InventoryOverviewItem[]> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.pageSize) search.set("pageSize", String(params.pageSize));
  if (params?.warehouseId) search.set("warehouseId", params.warehouseId);
  if (params?.category) search.set("category", params.category);
  const qs = search.toString();
  return fetchApi<InventoryOverviewItem[]>(`/inventory${qs ? `?${qs}` : ""}`);
}

export function getWarehouses(): Promise<WarehouseStats[]> {
  return fetchApi<WarehouseStats[]>("/warehouses");
}

export function getTrends(params?: {
  weeks?: number;
  category?: string;
}): Promise<TrendHeatmapCell[]> {
  const search = new URLSearchParams();
  if (params?.weeks) search.set("weeks", String(params.weeks));
  if (params?.category) search.set("category", params.category);
  const qs = search.toString();
  return fetchApi<TrendHeatmapCell[]>(`/trends${qs ? `?${qs}` : ""}`);
}

export function getPredictions(params?: {
  productId?: string;
  category?: string;
  horizonDays?: number;
  limit?: number;
}): Promise<ProductForecast[]> {
  const search = new URLSearchParams();
  if (params?.productId) search.set("productId", params.productId);
  if (params?.category) search.set("category", params.category);
  if (params?.horizonDays) search.set("horizonDays", String(params.horizonDays));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return fetchApi<ProductForecast[]>(`/predictions${qs ? `?${qs}` : ""}`);
}

export function getStockoutAlerts(params?: {
  minRisk?: string;
  warehouseId?: string;
  limit?: number;
}): Promise<StockoutAlert[]> {
  const search = new URLSearchParams();
  if (params?.minRisk) search.set("minRisk", params.minRisk);
  if (params?.warehouseId) search.set("warehouseId", params.warehouseId);
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return fetchApi<StockoutAlert[]>(`/alerts/stockouts${qs ? `?${qs}` : ""}`);
}

export function getReorders(params?: {
  status?: string;
  warehouseId?: string;
  limit?: number;
}): Promise<ReorderRecord[]> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.warehouseId) search.set("warehouseId", params.warehouseId);
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return fetchApi<ReorderRecord[]>(`/reorders${qs ? `?${qs}` : ""}`);
}

export type { DemandForecastPoint, ProductForecast };

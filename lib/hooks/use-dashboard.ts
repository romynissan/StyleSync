"use client";

import {
  getDashboardSummary,
  getInventory,
  getPredictions,
  getReorders,
  getStockoutAlerts,
  getTrends,
  getWarehouses,
} from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  inventory: (page: number, pageSize: number) =>
    [...dashboardKeys.all, "inventory", page, pageSize] as const,
  warehouses: () => [...dashboardKeys.all, "warehouses"] as const,
  trends: () => [...dashboardKeys.all, "trends"] as const,
  predictions: () => [...dashboardKeys.all, "predictions"] as const,
  alerts: (limit: number) => [...dashboardKeys.all, "alerts", limit] as const,
  reorders: (limit: number) => [...dashboardKeys.all, "reorders", limit] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
  });
}

export function useInventory(page = 1, pageSize = 8) {
  return useQuery({
    queryKey: dashboardKeys.inventory(page, pageSize),
    queryFn: () => getInventory({ page, pageSize }),
  });
}

export function useWarehouses() {
  return useQuery({
    queryKey: dashboardKeys.warehouses(),
    queryFn: getWarehouses,
  });
}

export function useTrends() {
  return useQuery({
    queryKey: dashboardKeys.trends(),
    queryFn: () => getTrends({ weeks: 8 }),
  });
}

export function usePredictions() {
  return useQuery({
    queryKey: dashboardKeys.predictions(),
    queryFn: () => getPredictions({ limit: 3, horizonDays: 30 }),
  });
}

export function useStockoutAlerts(limit = 8) {
  return useQuery({
    queryKey: dashboardKeys.alerts(limit),
    queryFn: () => getStockoutAlerts({ limit }),
  });
}

export function useReorders(limit = 6) {
  return useQuery({
    queryKey: dashboardKeys.reorders(limit),
    queryFn: () => getReorders({ limit }),
  });
}

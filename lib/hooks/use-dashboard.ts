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
  inventory: (page: number) =>
    [...dashboardKeys.all, "inventory", page] as const,
  warehouses: () => [...dashboardKeys.all, "warehouses"] as const,
  trends: () => [...dashboardKeys.all, "trends"] as const,
  predictions: () => [...dashboardKeys.all, "predictions"] as const,
  alerts: () => [...dashboardKeys.all, "alerts"] as const,
  reorders: () => [...dashboardKeys.all, "reorders"] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
  });
}

export function useInventory(page = 1) {
  return useQuery({
    queryKey: dashboardKeys.inventory(page),
    queryFn: () => getInventory({ page, pageSize: 8 }),
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

export function useStockoutAlerts() {
  return useQuery({
    queryKey: dashboardKeys.alerts(),
    queryFn: () => getStockoutAlerts({ limit: 8 }),
  });
}

export function useReorders() {
  return useQuery({
    queryKey: dashboardKeys.reorders(),
    queryFn: () => getReorders({ limit: 6 }),
  });
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { CHART_COLORS, chartAxisTick } from "@/lib/chart-theme";
import { usePredictions } from "@/lib/hooks/use-dashboard";
import type { ProductForecast } from "@/types/domain";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function DemandForecastChart() {
  const { data, isLoading, isError } = usePredictions();
  const chartData = buildChartData(data ?? []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Demand forecast</CardTitle>
        <CardDescription>30-day predicted units by SKU</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : isError ? (
          <p className="text-body text-status-danger">
            Failed to load predictions.
          </p>
        ) : chartData.length === 0 ? (
          <p className="text-body text-ink-muted">No forecast data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={chartAxisTick}
                tickFormatter={(v: string) => v.slice(5)}
                axisLine={{ stroke: CHART_COLORS.border }}
                tickLine={false}
              />
              <YAxis
                tick={chartAxisTick}
                width={36}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F7F1EC",
                  border: `1px solid ${CHART_COLORS.border}`,
                  borderRadius: 12,
                  boxShadow: "0 4px 16px -4px rgb(47 47 47 / 0.1)",
                  fontSize: 12,
                  color: CHART_COLORS.ink,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: CHART_COLORS.muted }}
              />
              {(data ?? []).map((forecast, index) => (
                <Line
                  key={forecast.product.id}
                  type="monotone"
                  dataKey={forecast.product.name}
                  stroke={
                    CHART_COLORS.series[index % CHART_COLORS.series.length]
                  }
                  strokeWidth={index === 0 ? 2.5 : 1.75}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function buildChartData(forecasts: ProductForecast[]) {
  if (!forecasts || forecasts.length === 0) return [];

  const dateMap = new Map<string, Record<string, number | string>>();

  for (const forecast of forecasts) {
    for (const point of forecast.series) {
      const row = dateMap.get(point.date) ?? { date: point.date };
      row[forecast.product.sku] = point.predictedDemand;
      dateMap.set(point.date, row);
    }
  }

  return [...dateMap.values()].sort((a, b) =>
    String(a.date).localeCompare(String(b.date)),
  );
}

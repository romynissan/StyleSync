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
  Area,
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
        <CardDescription>
          30-day predicted units by product SKU
        </CardDescription>
      </CardHeader>

      <CardContent className="h-80">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : isError ? (
          <p className="text-body text-status-danger">
            Failed to load predictions.
          </p>
        ) : chartData.length === 0 ? (
          <p className="text-body text-ink-muted">
            No forecast data available.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={chartAxisTick}
                tickFormatter={(value: string) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
                axisLine={{ stroke: CHART_COLORS.border }}
                tickLine={false}
              />

              <YAxis
                tick={chartAxisTick}
                width={40}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#F7F1EC",
                  border: `1px solid ${CHART_COLORS.border}`,
                  borderRadius: 12,
                  boxShadow:
                    "0 8px 24px -8px rgba(47,47,47,0.15)",
                  fontSize: 12,
                  color: CHART_COLORS.ink,
                }}
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />

              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  fontSize: 12,
                  color: CHART_COLORS.muted,
                }}
              />

              {(data ?? []).map((forecast, index) => (
                <Line
                  key={forecast.product.id}
                  type="monotone"
                  dataKey={forecast.product.sku}
                  name={forecast.product.name}
                  stroke={
                    CHART_COLORS.series[
                      index % CHART_COLORS.series.length
                    ]
                  }
                  strokeWidth={index === 0 ? 3 : 2}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 0,
                  }}
                  animationDuration={800}
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
      const row = dateMap.get(point.date) ?? {
        date: point.date,
      };

      row[forecast.product.sku] = point.predictedDemand;

      dateMap.set(point.date, row);
    }
  }

  return [...dateMap.values()].sort((a, b) =>
    String(a.date).localeCompare(String(b.date)),
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrends } from "@/lib/hooks/use-dashboard";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

/** Warm neutrals → blush for trend intensity */
function scoreColor(score: number): string {
  if (score >= 80) return "bg-accent text-ink";
  if (score >= 65) return "bg-accent-muted text-ink";
  if (score >= 50) return "bg-surface-muted text-ink";
  if (score >= 35) return "bg-canvas text-ink-muted";
  return "bg-canvas text-ink-faint";
}

export function TrendHeatmap() {
  const { data, isLoading, isError } = useTrends();

  const categories = [...new Set(data?.map((c) => c.category) ?? [])].sort();
  const weeks = [...new Set(data?.map((c) => c.weekStart) ?? [])].sort();

  const lookup = new Map(
    data?.map((c) => [`${c.category}|${c.weekStart}`, c.avgTrendScore]) ?? [],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Trend heatmap</CardTitle>
        <CardDescription>
          Category momentum averaged by week
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : isError ? (
          <p className="text-body text-status-danger">Failed to load trends.</p>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `7.5rem repeat(${weeks.length}, minmax(2.75rem, 1fr))`,
              }}
            >
              <div />
              {weeks.map((week) => (
                <div
                  key={week}
                  className="text-center text-caption text-ink-faint"
                >
                  {week.slice(5)}
                </div>
              ))}
              {categories.map((category) => (
                <Fragment key={category}>
                  <div className="flex items-center text-caption font-medium text-ink-muted">
                    {category}
                  </div>
                  {weeks.map((week) => {
                    const score = lookup.get(`${category}|${week}`);
                    return (
                      <div
                        key={`${category}-${week}`}
                        className={cn(
                          "flex h-10 items-center justify-center rounded-lg text-caption font-medium transition-soft",
                          score !== undefined
                            ? scoreColor(score)
                            : "bg-canvas text-ink-faint",
                        )}
                        title={
                          score !== undefined ? `Score: ${score}` : "No data"
                        }
                      >
                        {score !== undefined ? Math.round(score) : "—"}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

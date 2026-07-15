import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  delta?: string;
  deltaVariant?: "positive" | "negative" | "neutral" | "warning";
  icon?: ReactNode;
}

const deltaStyles = {
  positive: "text-brand-700",
  negative: "text-status-danger",
  neutral: "text-ink-muted",
  warning: "text-status-warning",
} as const;

export function Stat({
  label,
  value,
  delta,
  deltaVariant = "neutral",
  icon,
  className,
  ...props
}: StatProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-caption font-medium uppercase tracking-[0.06em] text-ink-muted">
          {label}
        </span>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-canvas text-ink-muted">
            {icon}
          </span>
        )}
      </div>
      <span className="text-kpi tabular-nums text-ink">{value}</span>
      {delta && (
        <span className={cn("text-caption font-medium", deltaStyles[deltaVariant])}>
          {delta}
        </span>
      )}
    </div>
  );
}

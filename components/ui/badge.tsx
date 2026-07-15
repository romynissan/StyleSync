import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-muted text-ink-muted",
  success: "bg-status-success-muted text-status-success",
  warning: "bg-status-warning-muted text-status-warning",
  danger: "bg-status-danger-muted text-status-danger",
  info: "bg-status-info-muted text-status-info",
  brand: "bg-accent-muted text-brand-800",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-caption font-medium capitalize tracking-wide",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

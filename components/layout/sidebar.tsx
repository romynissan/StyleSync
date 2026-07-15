"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  Package,
  RefreshCw,
  Settings,
  Sparkles,
  Warehouse,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Inventory", icon: Package, active: false },
  { label: "Forecasts", icon: BarChart3, active: false },
  { label: "Alerts", icon: AlertTriangle, active: false },
  { label: "Warehouses", icon: Warehouse, active: false },
  { label: "Reorders", icon: RefreshCw, active: false },
] as const;

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface-elevated lg:flex">
      <div className="flex items-start gap-3 border-b border-border-subtle px-5 py-4">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/40 text-ink">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-body font-semibold tracking-tight text-ink">
            StyleSync
          </p>
          <p className="mt-0.5 text-caption leading-snug text-ink-muted">
            Connecting Fashion Trends to Smarter Inventory Decisions
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Main">
        <p className="mb-2 px-3 text-caption font-medium uppercase tracking-[0.08em] text-ink-faint">
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-body transition-soft",
                item.active
                  ? "bg-accent text-accent-foreground font-medium shadow-card"
                  : "text-ink-muted hover:bg-surface-muted hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border-subtle p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-body text-ink-muted transition-soft hover:bg-surface-muted hover:text-ink"
        >
          <Settings className="h-4 w-4" strokeWidth={1.75} />
          Settings
        </button>
      </div>
    </aside>
  );
}

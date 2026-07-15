"use client";

import { Search } from "lucide-react";
import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border-subtle bg-canvas/85 backdrop-blur-md">
      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="min-w-0">
          <h1 className="text-display text-ink">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-body text-ink-muted">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="relative hidden min-w-[220px] flex-1 sm:block sm:flex-none">
            <span className="sr-only">Search inventory</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
              strokeWidth={1.75}
            />
            <input
              type="search"
              placeholder="Search SKUs, warehouses…"
              className="h-10 w-full rounded-xl border border-border bg-surface-elevated pl-9 pr-3 text-body text-ink placeholder:text-ink-faint transition-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>
          {actions}
        </div>
      </div>
    </header>
  );
}

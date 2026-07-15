"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  actions?: ReactNode;
}

export function DashboardShell({ children, actions }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="lg:pl-60">
        <Header
          title="StyleSync"
          subtitle="Connecting Fashion Trends to Smarter Inventory Decisions"
          actions={actions}
        />
        <main className="px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

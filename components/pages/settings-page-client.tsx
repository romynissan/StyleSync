"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Bell, Database, Sparkles } from "lucide-react";

const settingsSections = [
  {
    title: "AI predictions",
    description: "Configure how often StyleSync refreshes demand forecasts.",
    icon: Sparkles,
  },
  {
    title: "Alert thresholds",
    description: "Set stockout risk levels and notification preferences.",
    icon: Bell,
  },
  {
    title: "Data connections",
    description: "Manage warehouse, POS, and trend data integrations.",
    icon: Database,
  },
] as const;

export function SettingsPageClient() {
  return (
    <DashboardShell
      title="Settings"
      subtitle="Workspace preferences and integrations"
    >
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {settingsSections.map((section) => {
          const Icon = section.icon;

          return (
            <Card key={section.title} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                  <CardTitle>{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-ink-muted">
                  Configuration options for this section are coming soon.
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}

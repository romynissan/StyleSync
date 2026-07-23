import {
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  Package,
  RefreshCw,
  Settings,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const workspaceNavItems: NavItem[] = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
    description: "KPI summary and cross-functional snapshot",
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
    description: "On-hand position by SKU and warehouse",
  },
  {
    label: "Forecasts",
    href: "/forecasts",
    icon: BarChart3,
    description: "Demand predictions and trend momentum",
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
    description: "SKUs approaching stockout risk",
  },
  {
    label: "Warehouses",
    href: "/warehouses",
    icon: Warehouse,
    description: "Capacity utilization and inventory health",
  },
  {
    label: "Reorders",
    href: "/reorders",
    icon: RefreshCw,
    description: "Recommended replenishment actions",
  },
];

export const settingsNavItem: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
  description: "Workspace preferences and integrations",
};

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

import { WarehousesPageClient } from "@/components/pages/warehouses-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StyleSync | Warehouses",
};

export default function WarehousesPage() {
  return <WarehousesPageClient />;
}

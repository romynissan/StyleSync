import { InventoryPageClient } from "@/components/pages/inventory-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StyleSync | Inventory",
};

export default function InventoryPage() {
  return <InventoryPageClient />;
}

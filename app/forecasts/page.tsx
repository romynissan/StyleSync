import { ForecastsPageClient } from "@/components/pages/forecasts-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StyleSync | Forecasts",
};

export default function ForecastsPage() {
  return <ForecastsPageClient />;
}

import { withCacheHeaders } from "@/lib/api/cache-headers";
import { jsonError, jsonOk } from "@/lib/api/response";
import { parseIntParam, parseOptionalString } from "@/lib/api/query";
import { getStockoutAlerts } from "@/lib/services/alert.service";
import type { StockoutRiskLevel } from "@/types/domain";

const VALID_RISK_LEVELS: StockoutRiskLevel[] = [
  "none",
  "low",
  "medium",
  "critical",
];

function parseRiskLevel(value: string | null): StockoutRiskLevel | undefined {
  if (!value) return undefined;
  return VALID_RISK_LEVELS.includes(value as StockoutRiskLevel)
    ? (value as StockoutRiskLevel)
    : undefined;
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const alerts = await getStockoutAlerts({
      minRisk: parseRiskLevel(searchParams.get("minRisk")) ?? "low",
      warehouseId: parseOptionalString(searchParams.get("warehouseId")),
      limit: parseIntParam(searchParams.get("limit"), 25),
    });

    return withCacheHeaders(jsonOk(alerts));
  } catch (error) {
    console.error("[GET /api/alerts/stockouts]", error);
    return jsonError("Failed to fetch stockout alerts", 500, "ALERT_FETCH_ERROR");
  }
}

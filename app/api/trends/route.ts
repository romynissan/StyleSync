import { withCacheHeaders } from "@/lib/api/cache-headers";
import { jsonError, jsonOk } from "@/lib/api/response";
import { parseIntParam, parseOptionalString } from "@/lib/api/query";
import { getTrendHeatmap } from "@/lib/services/trend.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const weeks = parseIntParam(searchParams.get("weeks"), 8);

    const heatmap = await getTrendHeatmap({
      weeks,
      category: parseOptionalString(searchParams.get("category")),
    });

    return withCacheHeaders(jsonOk(heatmap));
  } catch (error) {
    console.error("[GET /api/trends]", error);
    return jsonError("Failed to fetch trend data", 500, "TREND_FETCH_ERROR");
  }
}

import { withCacheHeaders } from "@/lib/api/cache-headers";
import { jsonError, jsonOk } from "@/lib/api/response";
import { parseIntParam, parseOptionalString } from "@/lib/api/query";
import { getDemandForecasts } from "@/lib/services/prediction.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const forecasts = await getDemandForecasts({
      productId: parseOptionalString(searchParams.get("productId")),
      category: parseOptionalString(searchParams.get("category")),
      horizonDays: parseIntParam(searchParams.get("horizonDays"), 30),
      limit: parseIntParam(searchParams.get("limit"), 10),
    });

    return withCacheHeaders(jsonOk(forecasts));
  } catch (error) {
    console.error("[GET /api/predictions]", error);
    return jsonError(
      "Failed to fetch predictions",
      500,
      "PREDICTION_FETCH_ERROR",
    );
  }
}

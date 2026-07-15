import { withCacheHeaders } from "@/lib/api/cache-headers";
import { jsonError, jsonOk } from "@/lib/api/response";
import { parseIntParam, parseOptionalString } from "@/lib/api/query";
import { getRecentReorders } from "@/lib/services/reorder.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const reorders = await getRecentReorders({
      status: parseOptionalString(searchParams.get("status")),
      warehouseId: parseOptionalString(searchParams.get("warehouseId")),
      limit: parseIntParam(searchParams.get("limit"), 10),
    });

    return withCacheHeaders(jsonOk(reorders));
  } catch (error) {
    console.error("[GET /api/reorders]", error);
    return jsonError("Failed to fetch reorders", 500, "REORDER_FETCH_ERROR");
  }
}

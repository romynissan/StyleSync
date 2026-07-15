import { withCacheHeaders } from "@/lib/api/cache-headers";
import { jsonError, jsonOk } from "@/lib/api/response";
import { parseIntParam, parseOptionalString } from "@/lib/api/query";
import { getInventoryOverview } from "@/lib/services/inventory.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseIntParam(searchParams.get("page"), 1);
    const pageSize = parseIntParam(searchParams.get("pageSize"), 20);

    const { items, total } = await getInventoryOverview({
      warehouseId: parseOptionalString(searchParams.get("warehouseId")),
      category: parseOptionalString(searchParams.get("category")),
      page,
      pageSize,
    });

    return withCacheHeaders(jsonOk(items, { page, pageSize, total }));
  } catch (error) {
    console.error("[GET /api/inventory]", error);
    return jsonError("Failed to fetch inventory", 500, "INVENTORY_FETCH_ERROR");
  }
}

import { withCacheHeaders } from "@/lib/api/cache-headers";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getWarehouseStatistics } from "@/lib/services/warehouse.service";

export const revalidate = 60;

export async function GET() {
  try {
    const stats = await getWarehouseStatistics();
    return withCacheHeaders(jsonOk(stats));
  } catch (error) {
    console.error("[GET /api/warehouses]", error);
    return jsonError("Failed to fetch warehouses", 500, "WAREHOUSE_FETCH_ERROR");
  }
}

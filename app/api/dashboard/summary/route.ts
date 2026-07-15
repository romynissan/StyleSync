import { withCacheHeaders } from "@/lib/api/cache-headers";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getDashboardSummary } from "@/lib/services/dashboard.service";

export const revalidate = 60;

export async function GET() {
  try {
    const summary = await getDashboardSummary();
    return withCacheHeaders(jsonOk(summary));
  } catch (error) {
    console.error("[GET /api/dashboard/summary]", error);
    return jsonError(
      "Failed to fetch dashboard summary",
      500,
      "DASHBOARD_FETCH_ERROR",
    );
  }
}

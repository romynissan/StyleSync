import { jsonError, jsonOk } from "@/lib/api/response";
import { syncPredictionsFromAi } from "@/lib/services/prediction-sync.service";

export const maxDuration = 120;

export async function POST() {
  try {
    const result = await syncPredictionsFromAi();
    return jsonOk(result);
  } catch (error) {
    console.error("[POST /api/predictions/sync]", error);
    const message =
      error instanceof Error ? error.message : "Prediction sync failed";
    return jsonError(message, 500, "PREDICTION_SYNC_ERROR");
  }
}

"use client";

import { Button } from "@/components/ui";
import { dashboardKeys } from "@/lib/hooks/use-dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

async function syncPredictions(): Promise<{ productsUpdated: number }> {
  const response = await fetch("/api/predictions/sync", { method: "POST" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? "Sync failed");
  }
  const json = await response.json();
  return json.data;
}

export function useSyncPredictions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncPredictions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

interface SyncPredictionsButtonProps {
  syncMutation: ReturnType<typeof useSyncPredictions>;
}

export function SyncPredictionsButton({
  syncMutation,
}: SyncPredictionsButtonProps) {
  return (
    <Button
      onClick={() => syncMutation.mutate()}
      disabled={syncMutation.isPending}
    >
      <Sparkles className="h-4 w-4" strokeWidth={1.75} />
      {syncMutation.isPending ? "Running AI…" : "Sync AI predictions"}
    </Button>
  );
}

export function SyncPredictionsStatus({
  syncMutation,
}: SyncPredictionsButtonProps) {
  if (!syncMutation.isError && !syncMutation.isSuccess) {
    return null;
  }

  if (syncMutation.isError) {
    return (
      <div
        role="alert"
        className="mb-6 rounded-2xl border border-status-danger/20 bg-status-danger-muted px-4 py-3 text-body text-status-danger"
      >
        {syncMutation.error.message}
      </div>
    );
  }

  return (
    <div
      role="status"
      className="mb-6 rounded-2xl border border-status-success/20 bg-status-success-muted px-4 py-3 text-body text-status-success"
    >
      AI predictions synced ({syncMutation.data?.productsUpdated ?? 0} products).
    </div>
  );
}

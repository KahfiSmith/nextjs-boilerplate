"use client";

import { useHealthQuery } from "@/hooks";

export function HealthStatus() {
  const { data, error, isPending } = useHealthQuery();

  return (
    <div className="rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">API Health</p>
      <p className="mt-1">
        {isPending
          ? "Checking /api/health..."
          : error
            ? "Unable to reach the health endpoint."
            : `Status: ${data}`}
      </p>
    </div>
  );
}

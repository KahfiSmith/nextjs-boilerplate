import { getHealthStatus } from "@/lib/services/health.service";

export async function HealthStatus() {
  const status = await getHealthStatus();

  return (
    <div className="rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">API Health</p>
      <p className="mt-1">{`Status: ${status}`}</p>
    </div>
  );
}

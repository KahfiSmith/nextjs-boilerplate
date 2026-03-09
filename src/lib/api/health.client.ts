import { apiEndpoints } from "@/lib/api/endpoints";
import { fetchJson } from "@/lib/api/fetcher";
import { healthResponseSchema } from "@/lib/schemas";

export async function getHealthStatus() {
  const response = await fetchJson(apiEndpoints.health, {
    cache: "no-store",
    schema: healthResponseSchema,
  });

  return response.data.status;
}

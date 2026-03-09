"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/queries/query-keys";
import { getHealthStatus } from "@/lib/api";

export function useHealthQuery() {
  return useQuery({
    queryKey: queryKeys.system.health(),
    queryFn: getHealthStatus,
  });
}

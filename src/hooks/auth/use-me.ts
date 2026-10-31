"use client";

import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/api/query-keys";
import { useAuthStore } from "@/store";
import type { User } from "@/types";

export const useMe = () => {
  const isAuthenticated = useAuthStore((s) => s.status === "authenticated");

  const meQuery = useQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,
    queryFn: async (): Promise<User> => {
      const data = (await apiClient.get(API_ENDPOINTS.AUTH.ME)) as unknown;
      return data as User;
    },
    enabled: isAuthenticated,
  });

  return {
    user: meQuery.data,
    isLoading: meQuery.isLoading,
    isError: meQuery.isError,
    error: meQuery.error,
    refetch: meQuery.refetch,
  };
};

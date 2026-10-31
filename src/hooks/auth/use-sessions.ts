"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/api/query-keys";
import { useAuthStore } from "@/store";
import type { SessionItem } from "@/types";

export const useSessions = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.status === "authenticated");

  const sessionsQuery = useQuery({
    queryKey: QUERY_KEYS.AUTH.SESSIONS,
    queryFn: async (): Promise<SessionItem[]> => {
      const data = (await apiClient.get(API_ENDPOINTS.AUTH.SESSIONS)) as unknown;
      return Array.isArray(data) ? (data as SessionItem[]) : [];
    },
    enabled: isAuthenticated,
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) =>
      apiClient.delete(`${API_ENDPOINTS.AUTH.SESSIONS}/${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.SESSIONS });
    },
  });

  const revokeOtherSessionsMutation = useMutation({
    mutationFn: () => apiClient.delete(API_ENDPOINTS.AUTH.SESSIONS),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.SESSIONS });
    },
  });

  return {
    sessions: sessionsQuery.data ?? [],
    isLoading: sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    error: sessionsQuery.error,
    refetch: sessionsQuery.refetch,
    revokeSession: revokeSessionMutation.mutateAsync,
    isRevokingSession: revokeSessionMutation.isPending,
    revokeOtherSessions: revokeOtherSessionsMutation.mutateAsync,
    isRevokingOtherSessions: revokeOtherSessionsMutation.isPending,
  };
};

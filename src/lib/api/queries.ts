import type { QueryClient } from "@tanstack/react-query";

import { AUTH_ERROR_CODES } from "@/lib/api/auth-error-codes";
import { ApiError } from "@/lib/api/error-handler";
import { QUERY_KEYS } from "@/lib/api/query-keys";
import { clearAuthSession } from "@/store/auth-store";

export const queryDefaults = {
  auth: {
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 5 * 60 * 1000,
  },
  data: {
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    staleTime: 30 * 1000,
  },
  lists: {
    gcTime: 3 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
    staleTime: 15 * 1000,
  },
  profile: {
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  },
} as const;

export const queryClientConfig = {
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      gcTime: queryDefaults.data.gcTime,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: (failureCount: number, error: unknown) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: queryDefaults.data.staleTime,
    },
  },
};

export const invalidateAuthQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.SESSION });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE });
};

export const clearAuthQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.SESSION });
  queryClient.removeQueries({ queryKey: QUERY_KEYS.USER.PROFILE });
};

export const handleQueryError = (
  queryClient: QueryClient,
  error: unknown,
  queryKey?: readonly unknown[]
) => {
  const errorCode = (error as { response?: { data?: { code?: string } } })?.response?.data?.code;

  if (
    errorCode === AUTH_ERROR_CODES.REFRESH_TOKEN_EXPIRED ||
    errorCode === AUTH_ERROR_CODES.REFRESH_TOKEN_REUSED ||
    errorCode === AUTH_ERROR_CODES.SESSION_REVOKED ||
    errorCode === AUTH_ERROR_CODES.ACCOUNT_DISABLED
  ) {
    clearAuthQueries(queryClient);
    clearAuthSession();
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  } else if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn("Query Error:", { error, queryKey });
  }
};

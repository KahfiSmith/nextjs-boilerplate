"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { clearAuthQueries } from "@/lib/api/queries";
import { clearAuthSessionCookie } from "@/lib/auth/session";
import { clearAuthSession } from "@/store/auth-store";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
    onSettled: () => {
      document.cookie = clearAuthSessionCookie();
      clearAuthSession();
      clearAuthQueries(queryClient);
      router.push(ROUTES.LOGIN);
    },
  });

  return {
    isPending: logoutMutation.isPending,
    logout: logoutMutation.mutateAsync,
  };
};

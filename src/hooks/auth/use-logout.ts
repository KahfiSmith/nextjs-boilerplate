"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authBroadcaster } from "@/lib/api/auth-broadcast";
import { authClient } from "@/lib/api/client";
import { useAuthStore } from "@/store";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => authClient.post(API_ENDPOINTS.AUTH.LOGOUT),
    onSettled: () => {
      useAuthStore.getState().clearSession();
      authBroadcaster.postMessage({ type: "AUTH_LOGOUT" });
      queryClient.clear();
      router.replace(ROUTES.LOGIN);
    },
  });

  return {
    isPending: logoutMutation.isPending,
    logout: logoutMutation.mutateAsync,
  };
};

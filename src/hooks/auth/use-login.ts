"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authClient } from "@/lib/api/client";
import type { LoginInput } from "@/lib/schemas/auth.schema";
import { useAuthStore } from "@/store/auth-store";
import type { ApiResponse, BackendAuthPayload } from "@/types/auth.types";
import { mapAuthPayload } from "@/types/auth.types";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const response = await authClient.post<ApiResponse<BackendAuthPayload>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      const envelope = response.data;
      return mapAuthPayload(envelope.data);
    },
    onSuccess: (session, variables) => {
      useAuthStore.getState().setSession(session);
      queryClient.clear();
      router.replace(variables.redirectTo || ROUTES.PROFILE);
    },
  });

  return {
    isPending: loginMutation.isPending,
    login: loginMutation.mutateAsync,
  };
};

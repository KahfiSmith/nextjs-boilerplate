"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authClient } from "@/lib/api/client";
import { type LoginInput, sanitizeInternalRedirect } from "@/lib/schemas/auth.schema";
import { useAuthStore } from "@/store";
import type { ApiResponse, BackendAuthPayload } from "@/types";
import { mapAuthPayload } from "@/types";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const response = await authClient.post<ApiResponse<BackendAuthPayload>>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email: credentials.email,
          password: credentials.password,
        }
      );
      const envelope = response.data;
      return mapAuthPayload(envelope.data);
    },
    onSuccess: (session, variables) => {
      useAuthStore.getState().setSession(session);
      queryClient.clear();
      const destination = sanitizeInternalRedirect(variables.redirectTo, ROUTES.PROFILE);
      router.replace(destination);
    },
  });

  return {
    isPending: loginMutation.isPending,
    login: loginMutation.mutateAsync,
  };
};

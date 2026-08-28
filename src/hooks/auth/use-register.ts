"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { authClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { RegisterInput } from "@/lib/schemas/auth.schema";
import { useAuthStore } from "@/store";
import type { ApiResponse, BackendAuthPayload } from "@/types";
import { mapAuthPayload } from "@/types";

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await authClient.post<ApiResponse<BackendAuthPayload>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      return mapAuthPayload(response.data.data);
    },
    onSuccess: (session) => {
      useAuthStore.getState().setSession(session);
      queryClient.clear();
      router.replace(ROUTES.PROFILE);
    },
  });

  return {
    isPending: registerMutation.isPending,
    register: registerMutation.mutateAsync,
  };
};

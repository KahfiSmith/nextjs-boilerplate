"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authClient } from "@/lib/api/client";
import type { ResetPasswordInput } from "@/lib/schemas/auth.schema";
import type { ApiResponse } from "@/types";

export const useResetPassword = () => {
  const router = useRouter();

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const response = await authClient.post<ApiResponse<null>>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      router.replace(ROUTES.LOGIN);
    },
  });

  return {
    isPending: resetPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
  };
};

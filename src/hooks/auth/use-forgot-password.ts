"use client";

import { useMutation } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authClient } from "@/lib/api/client";
import type { ForgotPasswordInput } from "@/lib/schemas/auth.schema";
import type { ApiResponse } from "@/types";

export const useForgotPassword = () => {
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const response = await authClient.post<ApiResponse<null>>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        data
      );
      return response.data;
    },
  });

  return {
    isPending: forgotPasswordMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
  };
};

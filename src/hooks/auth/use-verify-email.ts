"use client";

import { useMutation } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authClient } from "@/lib/api/client";
import type { VerifyEmailInput } from "@/lib/schemas/auth.schema";
import type { ApiResponse } from "@/types";

export const useVerifyEmail = () => {
  const verifyEmailMutation = useMutation({
    mutationFn: async (data: VerifyEmailInput) => {
      const response = await authClient.post<ApiResponse<null>>(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        data
      );
      return response.data;
    },
  });

  return {
    isPending: verifyEmailMutation.isPending,
    verifyEmail: verifyEmailMutation.mutateAsync,
  };
};

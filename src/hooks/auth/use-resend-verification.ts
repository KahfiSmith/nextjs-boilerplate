"use client";

import { useMutation } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authClient } from "@/lib/api/client";
import type { ResendVerificationInput } from "@/lib/schemas/auth.schema";
import type { ApiResponse } from "@/types";

export const useResendVerification = () => {
  const resendMutation = useMutation({
    mutationFn: async (data: ResendVerificationInput) => {
      const response = await authClient.post<ApiResponse<null>>(
        API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
        data
      );
      return response.data;
    },
  });

  return {
    isPending: resendMutation.isPending,
    resendVerification: resendMutation.mutateAsync,
  };
};

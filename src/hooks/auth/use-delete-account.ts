"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authBroadcaster } from "@/lib/api/auth-broadcast";
import { apiClient } from "@/lib/api/client";
import type { DeleteAccountInput } from "@/lib/schemas/auth.schema";
import { useAuthStore } from "@/store";

export const useDeleteAccount = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteAccountMutation = useMutation({
    mutationFn: (data: DeleteAccountInput) =>
      apiClient.delete(API_ENDPOINTS.AUTH.DELETE_ACCOUNT, {
        data,
        withCredentials: true,
      }),
    onSuccess: () => {
      useAuthStore.getState().clearSession();
      authBroadcaster.postMessage({ type: "AUTH_LOGOUT" });
      queryClient.clear();
      router.replace(ROUTES.LOGIN);
    },
  });

  return {
    isPending: deleteAccountMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
  };
};

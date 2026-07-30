"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { RegisterInput } from "@/lib/schemas/auth.schema";

export const useRegister = () => {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) =>
      apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data),
    onSuccess: () => {
      router.push(ROUTES.LOGIN);
    },
  });

  return {
    isPending: registerMutation.isPending,
    register: registerMutation.mutateAsync,
  };
};

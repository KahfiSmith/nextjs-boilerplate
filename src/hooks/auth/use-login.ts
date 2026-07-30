"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { setAuthSessionCookie } from "@/lib/auth/session";
import { setAuthSession } from "@/store/auth-store";
import type { AuthSession, LoginInput } from "@/types/auth.types";

export const useLogin = () => {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginInput) =>
      apiClient.post<AuthSession>(API_ENDPOINTS.AUTH.LOGIN, credentials),
    onSuccess: (session, variables) => {
      document.cookie = setAuthSessionCookie(session);
      setAuthSession(session);
      router.push(variables.redirectTo || ROUTES.PROFILE);
    },
  });

  return {
    isPending: loginMutation.isPending,
    login: loginMutation.mutateAsync,
  };
};
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { routes } from "@/config";
import {
  clearAuthSessionCookie,
  createBootstrapSession,
  getAuthStrategyMeta,
  serializeAuthSessionCookie,
} from "@/lib/auth";
import { clearAuthSession, setAuthSession } from "@/store";
import type { AuthActionResult, AuthStrategy, LoginInput } from "@/types";

const ensureCredentials = ({ email, password }: LoginInput) => {
  if (!email.trim() || !password.trim()) {
    throw new Error("Email and password are required.");
  }
};

export const useLogin = (authStrategy: AuthStrategy) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const login = async (input: LoginInput): Promise<AuthActionResult> => {
    try {
      setError(null);
      setMessage(null);
      ensureCredentials(input);

      const authMeta = getAuthStrategyMeta(authStrategy);

      if (!authMeta.enabled) {
        throw new Error("Authentication is disabled for this environment.");
      }

      const session = createBootstrapSession(input.email);
      document.cookie = serializeAuthSessionCookie(session);
      setAuthSession(session);

      const nextRoute = input.redirectTo || routes.profile;
      setMessage(authMeta.description);

      startTransition(() => {
        router.push(nextRoute);
        router.refresh();
      });

      return {
        message: authMeta.description,
        ok: true,
        session,
      };
    } catch (cause) {
      const nextError =
        cause instanceof Error ? cause.message : "Unable to create a session.";

      setError(nextError);

      return {
        message: nextError,
        ok: false,
      };
    }
  };

  const logout = () => {
    document.cookie = clearAuthSessionCookie();
    clearAuthSession();

    startTransition(() => {
      router.push(routes.login);
      router.refresh();
    });
  };

  return {
    error,
    isPending,
    login,
    logout,
    message,
  };
};

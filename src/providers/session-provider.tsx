"use client";

import { useEffect, useRef } from "react";

import { refreshAccessToken } from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/error-handler";
import { clearAuthSession, setAuthUnavailable, useAuthStore } from "@/store";

export function SessionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isBootstrapping = useRef(false);

  useEffect(() => {
    if (isBootstrapping.current) return;
    isBootstrapping.current = true;

    async function bootstrapSession() {
      useAuthStore.getState().setChecking();

      try {
        await refreshAccessToken();
      } catch (err) {
        const apiError = normalizeApiError(err);
        if (apiError.status === 0 || apiError.status >= 500 || apiError.status === 429) {
          setAuthUnavailable();
        } else {
          clearAuthSession();
        }
      }
    }

    bootstrapSession();
  }, []);

  return <>{children}</>;
}

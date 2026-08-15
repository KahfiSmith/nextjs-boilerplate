"use client";

import { useEffect, useRef } from "react";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authClient } from "@/lib/api/client";
import { clearAuthSession, setAuthSession, useAuthStore } from "@/store";
import type { ApiResponse, BackendAuthPayload } from "@/types";
import { mapAuthPayload } from "@/types";

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
        const response = await authClient.post<ApiResponse<BackendAuthPayload>>(
          API_ENDPOINTS.AUTH.REFRESH
        );
        const envelope = response.data;
        const session = mapAuthPayload(envelope.data);
        setAuthSession(session);
      } catch {
        clearAuthSession();
      }
    }

    bootstrapSession();
  }, []);

  return <>{children}</>;
}

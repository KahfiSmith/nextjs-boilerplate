"use client";

import { useEffect } from "react";

import { setAuthSession } from "@/store/auth-store";
import type { AuthSession } from "@/types/auth.types";

export function SessionProvider({
  children,
  initialSession = null,
}: Readonly<{
  children: React.ReactNode;
  initialSession?: AuthSession | null;
}>) {
  useEffect(() => {
    if (initialSession) {
      setAuthSession(initialSession);
    }
  }, [initialSession]);

  return children;
}

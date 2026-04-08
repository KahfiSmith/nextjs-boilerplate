"use client";

import { useEffect } from "react";

import { setAuthSession } from "@/store";
import type { AuthSession } from "@/types";

export function SessionProvider({
  children,
  initialSession = null,
}: Readonly<{
  children: React.ReactNode;
  initialSession?: AuthSession | null;
}>) {
  useEffect(() => {
    setAuthSession(initialSession);
  }, [initialSession]);

  return children;
}

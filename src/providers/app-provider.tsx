"use client";

import { Toaster } from "sonner";

import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import type { AuthSession } from "@/types/auth.types";

export function AppProvider({
  children,
  initialSession = null,
}: Readonly<{
  children: React.ReactNode;
  initialSession?: AuthSession | null;
}>) {
  return (
    <QueryProvider>
      <SessionProvider initialSession={initialSession}>
        {children}
        <Toaster position="top-right" richColors />
      </SessionProvider>
    </QueryProvider>
  );
}

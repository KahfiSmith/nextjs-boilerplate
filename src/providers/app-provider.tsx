"use client";

import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { AuthSession } from "@/types";

export function AppProvider({
  children,
  initialSession = null,
}: Readonly<{
  children: React.ReactNode;
  initialSession?: AuthSession | null;
}>) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SessionProvider initialSession={initialSession}>
          {children}
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

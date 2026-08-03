"use client";

import { Toaster } from "sonner";

import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";

export function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <SessionProvider>
        {children}
        <Toaster position="top-right" richColors />
      </SessionProvider>
    </QueryProvider>
  );
}

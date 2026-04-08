"use client";

import { hasPermission } from "@/lib/auth";
import { useAuthStore } from "@/store";

export const useProfile = () => {
  const session = useAuthStore((state) => state.session);

  return {
    canReadProfile: hasPermission(session, "profile:read"),
    isAuthenticated: Boolean(session),
    session,
    user: session?.user ?? null,
  };
};

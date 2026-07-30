import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthSession } from "@/types/auth.types";

interface AuthStoreState {
  clearSession: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      clearSession: () => set({ session: null }),
      getAccessToken: () => get().session?.accessToken ?? null,
      getRefreshToken: () => get().session?.refreshToken ?? null,
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: "auth-session",
    }
  )
);

export const getAuthSessionSnapshot = () => useAuthStore.getState().session;
export const getAccessToken = () => useAuthStore.getState().getAccessToken();
export const getRefreshToken = () => useAuthStore.getState().getRefreshToken();

export const setAuthSession = (session: AuthSession | null) => {
  useAuthStore.getState().setSession(session);
};

export const clearAuthSession = () => {
  useAuthStore.getState().clearSession();
};

import { create } from "zustand";

import type { AuthSession, User } from "@/types";

export type AuthStatus = "idle" | "checking" | "authenticated" | "unauthenticated";

export type AuthState = {
  accessToken: string | null;
  clearSession: () => void;
  setAccessToken: (accessToken: string) => void;
  setChecking: () => void;
  setSession: (session: AuthSession) => void;
  status: AuthStatus;
  user: User | null;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  clearSession: () =>
    set({
      accessToken: null,
      status: "unauthenticated",
      user: null,
    }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setChecking: () => set({ status: "checking" }),
  setSession: (session) =>
    set({
      accessToken: session.accessToken,
      status: "authenticated",
      user: session.user,
    }),
  status: "idle",
  user: null,
}));

export const getAuthSessionSnapshot = () => useAuthStore.getState();
export const getAccessToken = () => useAuthStore.getState().accessToken;

export const setAuthSession = (session: AuthSession) => {
  useAuthStore.getState().setSession(session);
};

export const clearAuthSession = () => {
  useAuthStore.getState().clearSession();
};

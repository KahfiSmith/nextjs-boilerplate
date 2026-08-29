import { create } from "zustand";

import type { AuthSession, User } from "@/types";

export type AuthStatus =
  | "idle"
  | "checking"
  | "authenticated"
  | "unauthenticated"
  | "unavailable";

export type AuthState = {
  accessToken: string | null;
  clearSession: () => void;
  setChecking: () => void;
  setSession: (session: AuthSession) => void;
  setUnavailable: () => void;
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
  setChecking: () => set({ status: "checking" }),
  setSession: (session) =>
    set({
      accessToken: session.accessToken,
      status: "authenticated",
      user: session.user,
    }),
  setUnavailable: () =>
    set({
      accessToken: null,
      status: "unavailable",
      user: null,
    }),
  status: "idle",
  user: null,
}));

export const getAccessToken = () => useAuthStore.getState().accessToken;

export const setAuthSession = (session: AuthSession) => {
  useAuthStore.getState().setSession(session);
};

export const clearAuthSession = () => {
  useAuthStore.getState().clearSession();
};

export const setAuthUnavailable = () => {
  useAuthStore.getState().setUnavailable();
};

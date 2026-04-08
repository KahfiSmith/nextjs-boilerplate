import { create } from "zustand";

import type { AuthSession } from "@/types";

interface AuthStoreState {
  clearSession: () => void;
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
}

export const useAuthStore = create<AuthStoreState>()((set) => ({
  clearSession: () => set({ session: null }),
  session: null,
  setSession: (session) => set({ session }),
}));

export const getAuthSessionSnapshot = () => useAuthStore.getState().session;

export const setAuthSession = (session: AuthSession | null) => {
  useAuthStore.getState().setSession(session);
};

export const clearAuthSession = () => {
  useAuthStore.getState().clearSession();
};

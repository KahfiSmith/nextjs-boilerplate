import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      setTheme: (theme) => {
        set({ theme });
        applyThemeClass(theme);
      },
      theme: "system",
    }),
    {
      name: "ui-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeClass(state.theme);
        }
      },
    }
  )
);

function applyThemeClass(theme: Theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

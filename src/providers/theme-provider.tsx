"use client";

import { createContext, useContext, useState } from "react";

type Theme = "light" | "system";

const ThemeContext = createContext<{
  setTheme: (theme: Theme) => void;
  theme: Theme;
}>({
  setTheme: () => undefined,
  theme: "system",
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: Readonly<{
  children: React.ReactNode;
  defaultTheme?: Theme;
}>) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemePreference = () => useContext(ThemeContext);

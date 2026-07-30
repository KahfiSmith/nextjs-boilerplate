export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

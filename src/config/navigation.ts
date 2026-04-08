import { routes } from "@/config/routes";

export const publicNavigation = [
  { href: routes.home, label: "Home" },
  { href: routes.login, label: "Login" },
  { href: routes.register, label: "Register" },
] as const;

export const authenticatedNavigation = [
  { href: routes.home, label: "Home" },
  { href: routes.profile, label: "Profile" },
] as const;

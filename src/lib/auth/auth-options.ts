import type { AuthSession, AuthStrategy } from "@/types";

const AUTH_STRATEGY_META: Record<
  AuthStrategy,
  { description: string; enabled: boolean; label: string }
> = {
  nextauth: {
    description: "Session bootstrap is enabled and can be replaced with NextAuth later.",
    enabled: true,
    label: "NextAuth-compatible",
  },
  external: {
    description: "Use the local bootstrap flow until the external backend contract is wired.",
    enabled: true,
    label: "External backend",
  },
  none: {
    description: "Authentication is disabled for this runtime.",
    enabled: false,
    label: "Disabled",
  },
};

const DEFAULT_SESSION_TTL_MS = 1000 * 60 * 60 * 8;

const getNameFromEmail = (email: string) => {
  const [localPart] = email.split("@");
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const getAuthStrategyMeta = (strategy: AuthStrategy) =>
  AUTH_STRATEGY_META[strategy];

export const createBootstrapSession = (
  email: string,
  ttlMs = DEFAULT_SESSION_TTL_MS
): AuthSession => ({
  expiresAt: new Date(Date.now() + ttlMs).toISOString(),
  user: {
    email,
    name: getNameFromEmail(email) || "Member",
    role: "member",
  },
});

export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
  },
  profile: {
    current: ["profile", "current"] as const,
  },
} as const;

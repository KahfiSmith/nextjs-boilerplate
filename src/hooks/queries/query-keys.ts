export const queryKeys = {
  auth: {
    session: () => ["auth", "session"] as const,
  },
  system: {
    health: () => ["system", "health"] as const,
  },
};

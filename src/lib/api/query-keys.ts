export const QUERY_KEYS = {
  AUTH: {
    SESSION: ["auth", "session"] as const,
    SESSIONS: ["auth", "sessions"] as const,
  },
  USER: {
    PROFILE: ["user", "profile"] as const,
  },
} as const;

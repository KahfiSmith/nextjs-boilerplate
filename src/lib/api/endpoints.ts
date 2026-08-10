export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    REFRESH: "/api/v1/auth/refresh",
    REGISTER: "/api/v1/auth/register",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
    RESEND_VERIFICATION: "/api/v1/auth/resend-verification",
    DELETE_ACCOUNT: "/api/v1/auth/account",
    ME: "/api/v1/auth/me",
  },
} as const;

const readRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const readOptionalEnv = (name: string, fallback: string): string => {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
};

const readOptionalNumberEnv = (
  name: string,
  fallback: number
): number => {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const readAuthStrategy = (): "nextauth" | "external" | "none" => {
  const value = process.env.AUTH_STRATEGY;

  if (value === "external" || value === "none") {
    return value;
  }

  return "nextauth";
};

const readAuthMode = (): "external" | "demo" => {
  const value = process.env.AUTH_MODE;

  if (value === "demo") {
    return "demo";
  }

  return "external";
};

const authStrategy = readAuthStrategy();

export const env = {
  authStrategy,
  appUrl: readOptionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  nextAuthUrl: readOptionalEnv("NEXTAUTH_URL", "http://localhost:3000"),
  nextAuthSecret:
    authStrategy === "nextauth"
      ? readRequiredEnv("NEXTAUTH_SECRET")
      : readOptionalEnv("NEXTAUTH_SECRET", "not-used"),
  authMode: readAuthMode(),
  backendApiUrl: process.env.BACKEND_API_URL,
  backendAuthLoginPath: readOptionalEnv(
    "BACKEND_AUTH_LOGIN_PATH",
    "/api/auth/login"
  ),
  backendAuthTimeoutMs: readOptionalNumberEnv("BACKEND_AUTH_TIMEOUT_MS", 8000),
  demoAuthName: readOptionalEnv("AUTH_DEMO_NAME", "Demo User"),
  demoAuthEmail: readOptionalEnv("AUTH_DEMO_EMAIL", "demo@example.com"),
  demoAuthPassword: readOptionalEnv("AUTH_DEMO_PASSWORD", "demo12345"),
};

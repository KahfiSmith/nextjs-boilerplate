import { z } from "zod";

const envSchema = z.object({
  AUTH_STRATEGY: z.enum(["nextauth", "external", "none"]).default("nextauth"),
  AUTH_MODE: z.enum(["external", "demo"]).default("external"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().default("not-used"),
  BACKEND_API_URL: z.string().url().optional(),
  BACKEND_AUTH_LOGIN_PATH: z.string().default("/api/auth/login"),
  BACKEND_AUTH_TIMEOUT_MS: z.coerce.number().positive().default(8000),
  AUTH_DEMO_NAME: z.string().default("Demo User"),
  AUTH_DEMO_EMAIL: z.string().email().default("demo@example.com"),
  AUTH_DEMO_PASSWORD: z.string().default("demo12345"),
}).transform((data) => {
  // If nextauth is the strategy, secret becomes practically required for functionality
  // We handle this logically in the app, but structural validation happens here
  return {
    authStrategy: data.AUTH_STRATEGY,
    authMode: data.AUTH_MODE,
    appUrl: data.NEXT_PUBLIC_APP_URL,
    nextAuthUrl: data.NEXTAUTH_URL,
    nextAuthSecret: data.NEXTAUTH_SECRET,
    backendApiUrl: data.BACKEND_API_URL,
    backendAuthLoginPath: data.BACKEND_AUTH_LOGIN_PATH,
    backendAuthTimeoutMs: data.BACKEND_AUTH_TIMEOUT_MS,
    demoAuthName: data.AUTH_DEMO_NAME,
    demoAuthEmail: data.AUTH_DEMO_EMAIL,
    demoAuthPassword: data.AUTH_DEMO_PASSWORD,
  };
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;

import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_API_URL: z
    .string()
    .url("NEXT_PUBLIC_BACKEND_API_URL must be a valid URL")
    .default("http://localhost:8080"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

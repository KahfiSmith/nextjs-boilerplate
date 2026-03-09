import { z } from "zod";

const externalUserIdSchema = z.union([z.string(), z.number()]);

export const loginCredentialsSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().trim().min(1),
  })
  .transform(({ email, password }) => ({
    email: email.toLowerCase(),
    password,
  }));

export const externalAuthUserPayloadSchema = z
  .object({
    id: externalUserIdSchema.optional(),
    userId: externalUserIdSchema.optional(),
    email: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    fullName: z.string().trim().min(1).optional(),
    role: z.string().trim().min(1).optional(),
  })
  .passthrough();

export const externalAuthResponseSchema = z
  .object({
    user: externalAuthUserPayloadSchema.optional(),
    data: z
      .object({
        user: externalAuthUserPayloadSchema.optional(),
      })
      .passthrough()
      .optional(),
    id: externalUserIdSchema.optional(),
    userId: externalUserIdSchema.optional(),
    email: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    fullName: z.string().trim().min(1).optional(),
    role: z.string().trim().min(1).optional(),
  })
  .passthrough();

export type NormalizedLoginCredentials = z.output<typeof loginCredentialsSchema>;
export type ExternalAuthResponse = z.infer<typeof externalAuthResponseSchema>;

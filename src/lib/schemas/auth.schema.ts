import { z } from "zod";

export const internalPathRegex = /^\/(?!\/)/;

export function isSafeInternalPath(path: string | null | undefined): boolean {
  if (!path || typeof path !== "string") return false;
  return internalPathRegex.test(path) && !path.includes("://");
}

export function sanitizeInternalRedirect(
  path: string | null | undefined,
  fallback = "/profile"
): string {
  return isSafeInternalPath(path) ? (path as string) : fallback;
}

const internalPath = z
  .string()
  .regex(internalPathRegex, "Must be an internal path starting with /")
  .max(512, "Path too long");

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
  redirectTo: internalPath.optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name cannot exceed 120 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  reset_token: z.string().min(1, "Reset token is required").max(128, "Token too long"),
  new_password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required").max(128, "Token too long"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters"),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required").max(72, "Password too long"),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

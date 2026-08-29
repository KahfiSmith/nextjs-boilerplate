import type { AuthErrorCode } from "@/lib/api/auth-error-codes";

export interface ApiResponse<T = unknown> {
  code?: AuthErrorCode | string;
  data: T;
  error?: unknown;
  message: string;
  request_id?: string;
  success: boolean;
}

import axios from "axios";

import { AUTH_ERROR_CODES, type AuthErrorCode } from "./auth-error-codes";
import type { ApiResponse } from "@/types";

export class ApiError extends Error {
  public readonly code: AuthErrorCode | string;
  public readonly details?: unknown;
  public readonly requestId?: string;
  public readonly status: number;

  constructor(options: {
    code?: AuthErrorCode | string;
    details?: unknown;
    message: string;
    requestId?: string;
    status: number;
  }) {
    super(options.message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code ?? (options.status >= 500 ? "INTERNAL_ERROR" : "BAD_REQUEST");
    this.details = options.details;
    this.requestId = options.requestId;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? (error.code === "ECONNABORTED" ? 408 : 0);
    const data = error.response?.data as ApiResponse | undefined;

    const code = data?.code ?? (status === 401 ? AUTH_ERROR_CODES.UNAUTHORIZED : status >= 500 ? "INTERNAL_ERROR" : "NETWORK_ERROR");
    const message = data?.message ?? error.message ?? "An unexpected API error occurred.";
    const requestId = data?.request_id ?? (error.response?.headers?.["x-request-id"] as string | undefined);
    const details = data?.error ?? error.response?.data;

    return new ApiError({
      code,
      details,
      message,
      requestId,
      status,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      code: "UNKNOWN_ERROR",
      message: error.message,
      status: 0,
    });
  }

  return new ApiError({
    code: "UNKNOWN_ERROR",
    message: "Unexpected error occurred.",
    status: 0,
  });
}

export const toApiErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  return normalizeApiError(error).message;
};

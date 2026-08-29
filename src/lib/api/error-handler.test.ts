import { describe, it, expect } from "vitest";
import { normalizeApiError, ApiError } from "./error-handler";
import { AxiosError, AxiosHeaders } from "axios";

describe("ApiError normalization", () => {
  it("passes through existing ApiError instances", () => {
    const original = new ApiError({
      message: "Custom error",
      status: 400,
      code: "VALIDATION_ERROR",
      requestId: "req-123",
    });
    const normalized = normalizeApiError(original);
    expect(normalized).toBe(original);
    expect(normalized.code).toBe("VALIDATION_ERROR");
    expect(normalized.requestId).toBe("req-123");
  });

  it("normalizes AxiosError with response payload and request_id", () => {
    const headers = new AxiosHeaders();
    const axiosErr = new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
      status: 401,
      statusText: "Unauthorized",
      headers,
      config: { headers },
      data: {
        success: false,
        code: "ACCESS_TOKEN_EXPIRED",
        message: "Token has expired",
        request_id: "req-xyz",
      },
    });

    const normalized = normalizeApiError(axiosErr);
    expect(normalized).toBeInstanceOf(ApiError);
    expect(normalized.status).toBe(401);
    expect(normalized.code).toBe("ACCESS_TOKEN_EXPIRED");
    expect(normalized.message).toBe("Token has expired");
    expect(normalized.requestId).toBe("req-xyz");
  });

  it("handles generic javascript errors", () => {
    const jsErr = new Error("Generic failure");
    const normalized = normalizeApiError(jsErr);
    expect(normalized.status).toBe(0);
    expect(normalized.code).toBe("UNKNOWN_ERROR");
    expect(normalized.message).toBe("Generic failure");
  });
});

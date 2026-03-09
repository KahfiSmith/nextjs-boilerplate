import type { ZodType } from "zod";

const DEFAULT_TIMEOUT_MS = 8000;

const readErrorMessage = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const message = candidate.error ?? candidate.message;

  return typeof message === "string" && message.trim().length > 0
    ? message
    : null;
};

const readPayload = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

interface FetchJsonOptions<TOutput> extends Omit<RequestInit, "body"> {
  jsonBody?: unknown;
  schema?: ZodType<TOutput>;
  timeoutMs?: number;
}

export async function fetchJson<TOutput = unknown>(
  input: RequestInfo | URL,
  options: FetchJsonOptions<TOutput> = {}
): Promise<TOutput> {
  const { jsonBody, schema, timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...init } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      body: jsonBody === undefined ? undefined : JSON.stringify(jsonBody),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    });

    const payload = await readPayload(response);

    if (!response.ok) {
      throw new ApiError(
        readErrorMessage(payload) ?? `Request failed with status ${response.status}.`,
        response.status,
        payload
      );
    }

    if (!schema) {
      return payload as TOutput;
    }

    const result = schema.safeParse(payload);

    if (!result.success) {
      throw new ApiError("Invalid response payload.", response.status, payload);
    }

    return result.data;
  } finally {
    clearTimeout(timeout);
  }
}

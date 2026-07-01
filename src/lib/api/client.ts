import { ApiError } from "@/lib/api/error-handler";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

export const apiClient = {
  async get<T>(input: RequestInfo | URL, init?: RequestInit) {
    return requestJson<T>(input, { ...init, method: "GET" });
  },
  async post<T>(
    input: RequestInfo | URL,
    body?: unknown,
    init?: RequestInit
  ) {
    return requestJson<T>(input, {
      ...init,
      body: body ? JSON.stringify(body) : undefined,
      method: "POST",
    });
  },
};

export const requestJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init?.headers ?? {}),
    },
  });

  let payload: T | { error?: string } | null = null;
  const rawText = await response.text().catch(() => "");

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = { error: rawText.substring(0, 500) }; // Fallback to raw text if not JSON
    }
  }

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : `Request failed with status ${response.status}.`;

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
};

import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { apiClient, refreshAccessToken } from "./client";
import { useAuthStore } from "@/store";
import { API_ENDPOINTS } from "./endpoints";

const server = setupServer(
  http.post(`*${API_ENDPOINTS.AUTH.REFRESH}`, () => {
    return HttpResponse.json({
      success: true,
      message: "Refreshed",
      data: {
        access_token: "new.jwt.access.token",
        expires_in: 900,
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          is_email_verified: true,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      },
    });
  }),
  http.get(`*${API_ENDPOINTS.AUTH.ME}`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (auth === "Bearer expired.token") {
      return HttpResponse.json(
        {
          success: false,
          code: "ACCESS_TOKEN_EXPIRED",
          message: "Access token has expired",
        },
        { status: 401 }
      );
    }
    if (auth === "Bearer new.jwt.access.token") {
      return HttpResponse.json({
        success: true,
        message: "Profile retrieved",
        data: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          is_email_verified: true,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      });
    }
    return HttpResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  useAuthStore.getState().clearSession();
});
afterAll(() => server.close());

describe("Auth refresh & single-flight interceptor", () => {
  it("deduplicates concurrent refresh requests into a single promise", async () => {
    const p1 = refreshAccessToken();
    const p2 = refreshAccessToken();
    expect(p1).toBe(p2);

    const [token1, token2] = await Promise.all([p1, p2]);
    expect(token1).toBe("new.jwt.access.token");
    expect(token2).toBe("new.jwt.access.token");
    expect(useAuthStore.getState().accessToken).toBe("new.jwt.access.token");
  });

  it("automatically refreshes and retries API request on ACCESS_TOKEN_EXPIRED", async () => {
    useAuthStore.getState().setSession({
      accessToken: "expired.token",
      expiresIn: 900,
      user: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        is_email_verified: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    });

    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    expect(response).toEqual({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      is_email_verified: true,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });
    expect(useAuthStore.getState().accessToken).toBe("new.jwt.access.token");
  });
});

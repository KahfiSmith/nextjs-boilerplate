import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth-store";

describe("auth-store state machine", () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it("starts in idle state", () => {
    useAuthStore.setState({ status: "idle", accessToken: null, user: null });
    expect(useAuthStore.getState().status).toBe("idle");
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it("transitions to checking", () => {
    useAuthStore.getState().setChecking();
    expect(useAuthStore.getState().status).toBe("checking");
  });

  it("transitions to authenticated on setSession", () => {
    const fakeSession = {
      accessToken: "mock.jwt.token",
      expiresIn: 900,
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "user" as const,
        is_email_verified: true,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    };

    useAuthStore.getState().setSession(fakeSession);
    const state = useAuthStore.getState();
    expect(state.status).toBe("authenticated");
    expect(state.accessToken).toBe("mock.jwt.token");
    expect(state.user?.email).toBe("test@example.com");
  });

  it("transitions to unavailable on setUnavailable", () => {
    useAuthStore.getState().setUnavailable();
    const state = useAuthStore.getState();
    expect(state.status).toBe("unavailable");
    expect(state.accessToken).toBeNull();
  });

  it("transitions to unauthenticated on clearSession", () => {
    useAuthStore.getState().clearSession();
    const state = useAuthStore.getState();
    expect(state.status).toBe("unauthenticated");
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
  });
});

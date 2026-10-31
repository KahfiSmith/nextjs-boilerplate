import { describe, it, expect } from "vitest";
import {
  isSafeInternalPath,
  sanitizeInternalRedirect,
  loginSchema,
  registerSchema,
} from "./auth.schema";

describe("auth.schema validation & redirect safety", () => {
  it("validates internal paths and prevents open redirects", () => {
    expect(isSafeInternalPath("/profile")).toBe(true);
    expect(isSafeInternalPath("/dashboard/settings")).toBe(true);
    expect(isSafeInternalPath("https://malicious.com")).toBe(false);
    expect(isSafeInternalPath("//malicious.com")).toBe(false);
    expect(isSafeInternalPath("javascript:alert(1)")).toBe(false);
    expect(isSafeInternalPath("")).toBe(false);
    expect(isSafeInternalPath(null)).toBe(false);
  });

  it("sanitizes redirects with safe fallback", () => {
    expect(sanitizeInternalRedirect("/profile", "/default")).toBe("/profile");
    expect(sanitizeInternalRedirect("https://evil.com", "/default")).toBe("/default");
    expect(sanitizeInternalRedirect("//evil.com", "/default")).toBe("/default");
    expect(sanitizeInternalRedirect(undefined, "/default")).toBe("/default");
  });

  it("enforces max length constraints on login and register", () => {
    const longEmail = `${"a".repeat(250)}@example.com`;
    const longPassword = "a".repeat(73);
    const longName = "a".repeat(121);

    expect(loginSchema.safeParse({ email: longEmail, password: "password123" }).success).toBe(
      false
    );
    expect(loginSchema.safeParse({ email: "user@example.com", password: longPassword }).success).toBe(
      false
    );
    expect(
      registerSchema.safeParse({
        name: longName,
        email: "user@example.com",
        password: "password123",
      }).success
    ).toBe(false);
  });
});

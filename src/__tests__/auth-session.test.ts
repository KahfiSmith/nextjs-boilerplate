import {
  parseAuthSessionCookie,
  serializeAuthSessionCookie,
} from "@/lib/auth/token";
import type { AuthSession } from "@/types";

describe("Auth Session Cookie Helpers", () => {
  const mockSession: AuthSession = {
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
    user: {
      email: "test@example.com",
      name: "Test User",
      role: "member",
    },
  };

  describe("serializeAuthSessionCookie", () => {
    it("should serialize a session object into a valid cookie string", () => {
      const cookieString = serializeAuthSessionCookie(mockSession);

      expect(cookieString).toContain("app.auth.session=");
      expect(cookieString).toContain("Path=/;");
      expect(cookieString).toContain("SameSite=Lax");
      expect(cookieString).toMatch(/Max-Age=\d+/);
    });

    it("should set Max-Age to 0 if the session is already expired", () => {
      const expiredSession: AuthSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() - 1000 * 60).toISOString(), // 1 minute ago
      };

      const cookieString = serializeAuthSessionCookie(expiredSession);
      expect(cookieString).toContain("Max-Age=0");
    });
  });

  describe("parseAuthSessionCookie", () => {
    it("should parse a valid session cookie string back into an object", () => {
      const encodedValue = encodeURIComponent(JSON.stringify(mockSession));
      
      const parsedSession = parseAuthSessionCookie(encodedValue);
      
      expect(parsedSession).toEqual(mockSession);
    });

    it("should return null for undefined input", () => {
      const parsedSession = parseAuthSessionCookie(undefined);
      expect(parsedSession).toBeNull();
    });

    it("should return null for invalid JSON string", () => {
      const parsedSession = parseAuthSessionCookie("invalid-json-string");
      expect(parsedSession).toBeNull();
    });

    it("should return null if the parsed object doesn't match the expected schema", () => {
      const invalidSession = { randomField: "data" };
      const encodedValue = encodeURIComponent(JSON.stringify(invalidSession));
      
      const parsedSession = parseAuthSessionCookie(encodedValue);
      expect(parsedSession).toBeNull();
    });
  });

  describe("End-to-End serialization cycle", () => {
    it("should reliably serialize and then parse back to the original object", () => {
      // 1. Serialize
      const fullCookieString = serializeAuthSessionCookie(mockSession);
      
      // 2. Extract just the value part (how `cookies().get('name').value` behaves)
      const valueMatch = fullCookieString.match(/app\.auth\.session=([^;]+)/);
      const cookieValue = valueMatch ? valueMatch[1] : undefined;
      
      expect(cookieValue).toBeDefined();

      // 3. Parse back
      const parsedSession = parseAuthSessionCookie(cookieValue);
      
      // 4. Assert equality
      expect(parsedSession).toEqual(mockSession);
    });
  });
});

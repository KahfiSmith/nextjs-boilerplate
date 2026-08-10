# Logging & Observability Guide (Frontend Next.js Boilerplate)

This document defines how the frontend should log, what it may log, and what it must never log. It is intentionally small because the current app has no server-side route handlers and no logging library installed.

## Current State

- No frontend logging library or error-tracking service is installed.
- The API layer uses Axios; there is no request-logging middleware in the client today.
- The only backend logging is owned by the Go Fiber backend and is out of scope for this file.

## When to Log

- Use `console.error` for caught errors that are actionable (for example a failed refresh or a failed login) while debugging.
- Do not add logging for the sake of it. If a message would not help diagnose a real failure, omit it.
- Remove or gate debug logging before shipping.

## What Never to Log

- Access tokens, refresh tokens, or any session data.
- The refresh cookie value.
- Full request bodies or full response bodies for auth endpoints.
- Passwords, or any value from a password field.
- Raw backend error stacks if they can leak internal details. Log a safe message instead.

## What Is Useful to Log

- The failing operation (for example "refresh failed") and, when safe, a stable identifier such as the request URL path.
- The backend error code (`response.data.code`) when present, because codes like `ACCESS_TOKEN_EXPIRED` drive client behavior.
- The HTTP status when it helps distinguish `401` from `500`.

## Request Correlation

- When a request fails, prefer logging `error.response?.status` and `error.config?.url` over dumping the whole error object.
- If you introduce a request ID later, propagate it in headers consistently and log it with each failure. Do not add this before the backend supports it.

## Future Work

- Add a logging/error-tracking library only when there is a concrete need, such as a production error dashboard.
- If server-side route handlers are added under `src/app/api`, give them request logging and structured error responses.
- Consider `next/dynamic` and the browser's `console` only after the current client-only flow needs them.

## Related Docs

- `docs/API.md` for the error envelope and auth error codes
- `docs/SECURITY.md` for what must never be exposed in logs

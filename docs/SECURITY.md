# Security Guide (Frontend Next.js Boilerplate)

This document defines security rules for frontend code in this repository. It intentionally scopes to what a frontend can control. Anything not listed here is owned by the Go Fiber backend.

## Current Trust Boundary

- The frontend talks directly to the backend configured by `NEXT_PUBLIC_BACKEND_API_URL` (local default: `http://localhost:8080`).
- The backend owns refresh-token issuance, rotation, revocation, and the HttpOnly `refresh_token` cookie.
- The frontend holds only the short-lived JWT access token in the non-persisted Zustand store and never reads or writes the refresh cookie from JavaScript.
- `middleware.ts` is currently a pass-through scaffold; the active profile redirect is handled client-side after session bootstrap.

## Hard Rules

- Never commit secrets or credentials to this repository.
- Never place secrets in `NEXT_PUBLIC_*` environment variables. Anything prefixed `NEXT_PUBLIC_` is inlined into the client bundle and becomes publicly readable.
- Never store the access token, refresh token, or user session in `localStorage` or `sessionStorage`. The current auth store is non-persisted by design; keep it that way.
- Do not read or log the refresh cookie from JavaScript.
- Do not expose raw internal errors to clients. Map backend failures to a safe message before rendering.

## Environment Variables

- `NEXT_PUBLIC_BACKEND_API_URL` is the only env var in use. It is public by definition and must not carry any secret value.
- `DATABASE_URL` is reserved for future backend/database use. If it is ever needed locally, keep it only in env files that are git-ignored (for example `.env.local`).
- When adding an env var, decide whether it is truly public. If it is secret, do not prefix it with `NEXT_PUBLIC_` and do not document a committed default.

## Auth Flow Notes

- Login, refresh, and logout use `authClient`, which sends credentials via `withCredentials: true`.
- Protected business requests use `apiClient`, which attaches `Authorization: Bearer <access_token>` from the store.
- `apiClient` retries exactly one request after a `401` with `code === "ACCESS_TOKEN_EXPIRED"`. When the refresh fails, the client clears the session and redirects to `/login`.
- Keep the retry and redirect behavior explicit. Do not silently swallow refresh failures.

## Common Vulnerabilities

- **XSS:** Treat all user-provided content as data, not markup. React escapes by default; avoid `dangerouslySetInnerHTML` unless the payload is sanitized and trusted.
- **CSRF:** The refresh cookie is sent by the browser automatically. Rely on the backend's SameSite/CSRF protection and never send the cookie value in request bodies or headers.
- **Token leakage:** Do not log tokens, put them in query strings, or expose them in error messages or UI text.
- **Open redirects:** When navigating after login, only follow known routes. Do not honor arbitrary `redirectTo` values from the URL without allow-listing them.

## Frontend Validation

- Validate input at the boundary (forms) with the shared Zod schemas in `src/lib/schemas` before sending requests.
- Never trust that client-side validation protects the backend. The backend must always re-validate.

## Security Review Checklist

- [ ] No secrets in committed files or `NEXT_PUBLIC_*`.
- [ ] No token or session persisted in browser storage.
- [ ] No `dangerouslySetInnerHTML` without sanitization.
- [ ] No tokens or cookies in logs or error messages.
- [ ] Refresh failures clear the session and redirect.
- [ ] Input validated with shared schemas before it leaves the client.

## Related Docs

- `docs/ARCHITECTURE.md` for the auth boundary
- `docs/API.md` for endpoint contracts and error codes
- `docs/RULES.md` for hard implementation rules

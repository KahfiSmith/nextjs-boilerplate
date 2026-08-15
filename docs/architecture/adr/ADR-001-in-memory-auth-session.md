# ADR-001: In-Memory Auth Session with HttpOnly Refresh Cookie

## Context

Client-side web applications need to store an access token securely. The
options have distinct trade-offs:

- `localStorage`/`sessionStorage` — readable by any JavaScript, so an XSS
  injection exfiltrates the token directly.
- In-memory only — the token survives only for the page session, so an XSS
  injection must be live to steal it.
- Backend-issued HttpOnly cookie — the token never reaches JavaScript, but
  requires the backend to manage session state and rotation.

The app is a frontend-only Next.js client backed by a Go Fiber API
(`fiber-boilerplate`) that already owns session management.

## Decision

- Access tokens are kept strictly in-memory in a non-persisted Zustand store
  (`useAuthStore`). Nothing is written to `localStorage`/`sessionStorage`.
- Refresh tokens are issued and stored as `HttpOnly` secure cookies by the
  backend. JavaScript cannot read them.
- On app mount, `SessionProvider` calls `POST /api/v1/auth/refresh` to restore
  the in-memory session from the refresh cookie.

## Consequences

- XSS can only steal a token that is alive in memory, reducing the exposure
  window.
- Page reloads require a round-trip to `/refresh` before the user appears
  authenticated (brief `checking` state).
- The backend must support refresh rotation and cookie handling (see
  backend ADR-001).

## Status

Accepted.

# ADR-001: Next.js App Router with In-Memory Auth Session

## Context
Client-side web applications require secure access token storage resistant to XSS and CSRF attacks.

## Decision
- Access tokens are kept strictly in-memory inside Zustand store (`useAuthStore`).
- Refresh tokens are issued and stored as `HttpOnly` secure cookies by the backend.
- `SessionProvider` bootstraps session credentials on initial application mount.

## Status
Accepted.

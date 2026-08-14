# Security Overview

Security design and trust boundaries for the Next.js frontend application.

## Trust boundary

```text
browser (untrusted)
  -> Next.js frontend (client components)
     -> Axios clients (src/lib/api)
        -> Go Fiber backend (NEXT_PUBLIC_BACKEND_API_URL)
```

The frontend is entirely client-side. It never holds the refresh token
(backend-owned HttpOnly cookie) and stores the access token only in memory.

## Authentication

### Current model

- Access token stored in memory only (`useAuthStore`, non-persisted Zustand
  store).
- Refresh token in `HttpOnly` cookie, managed by the backend.
- No `localStorage` or `sessionStorage` token persistence.
- Session bootstrap runs in `SessionProvider` on app mount via
  `POST /api/v1/auth/refresh`.
- Concurrent refresh requests are merged into a single-flight promise
  (`refreshAccessToken` in `src/lib/api/client.ts`).

### Threat model

| Threat | Mitigation |
|---|---|
| XSS token theft | Access token never touches `localStorage`/`sessionStorage`; kept in memory only |
| CSRF on refresh/logout | Refresh token lives in an HttpOnly cookie; requests sent with credentials |
| Token theft via logs | Lint rule `no-console` warns; secrets are never logged |
| Long-lived token exposure | Access token is short-lived and rotated via refresh |

The refresh endpoint (`POST /api/v1/auth/refresh`) is the only credential
source; it is exercised by `SessionProvider` and the single-flight retry path.

## Authorization

### Protected vs public routes

| Route      | Access            | Enforced by                                                      |
| ---------- | ----------------- | ---------------------------------------------------------------- |
| `/`        | public            | none                                                             |
| `/login`   | public            | redirects to `/profile` when already authenticated               |
| `/register`| public            | none                                                             |
| `/profile` | authenticated     | client-side guard redirects to `/login` when unauthenticated     |

### Where protection lives

- Route protection is enforced client-side in pages:
  - `(dashboard)/profile/page.tsx` redirects unauthenticated users to `/login`.
  - `(auth)/login/page.tsx` redirects authenticated users to `/profile`.
- `middleware.ts` is currently a pass-through (`NextResponse.next()`) and does
  not enforce access control.
- Session bootstrap via `/api/v1/auth/refresh`.

### Not implemented

- Server-side route guards (no `src/app/api/**`, no server enforcement).
- Role-based access control (RBAC).

# Feature: Authentication & User Session

## Overview

User authentication including registration, login, session persistence via
HttpOnly cookie refresh, and a protected profile route.

## Core flow

```text
browser
  -> /login -> LoginForm -> useLogin -> authClient POST /auth/login
  -> access token stored in-memory (auth-store)
  -> SessionProvider bootstraps via POST /auth/refresh on mount
  -> /profile renders user info; unauthenticated users redirect to /login
```

## Flow states

1. App mount: `SessionProvider` calls `POST /api/v1/auth/refresh`.
2. `useAuthStore` status: `idle → checking → authenticated | unauthenticated`.
3. Authenticated: access token in memory; `apiClient` attaches Bearer.
4. Logout: `useLogout` → `POST /auth/logout` → clears session → `/login`.
5. Delete account: `useDeleteAccount` → `DELETE /auth/account` (password
   confirmation) → clears session → `/login`.
6. Google SSO: `LoginForm` → navigate to `GET /auth/google` (browser redirect);
   backend sets the session and redirects back; `SessionProvider` bootstraps.

## Implementation map

| Concern | Files |
|---|---|
| Forms | `src/components/features/auth/` (`login-form`, `register-form`, `logout-button`, `delete-account-button`) |
| Hooks | `src/hooks/auth/` (`use-login`, `use-logout`, `use-register`, `use-delete-account`) |
| Validation | `src/lib/schemas/auth.schema.ts` |
| HTTP | `src/lib/api/endpoints.ts`, `client.ts` |
| Session state | `src/store/auth-store.ts` |
| Session bootstrap | `src/providers/session-provider.tsx` |
| Protected route | `src/app/(dashboard)/profile/page.tsx` |

## Endpoints

All 10 auth endpoints are defined in `src/lib/api/endpoints.ts`. Five are wired
to UI (login, register, refresh, logout, delete-account); the rest are defined
but not yet connected. Google OAuth endpoints (`GET /auth/google`,
`/auth/google/callback`) are browser-navigation only and live on the backend.
See [Authentication API](../api/authentication.md).

## Not yet implemented

- No features beyond authentication exist. There is no dashboard, no product
  workflows, and no additional business logic.

Feature docs must describe only implemented behavior. When a feature ships,
promote its durable decisions here.

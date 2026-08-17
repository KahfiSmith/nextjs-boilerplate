# Product Overview

## Product vision

This repository is the **frontend foundation** for a web application that
requires authentication and per-user data. The final product positioning,
personas, and business workflows are **not finalized yet** and must not be
invented by the frontend. The current surface proves the auth/session
foundation so that a real product can be built on top of it.

For what is planned next, see the [Roadmap](../../ROADMAP.md).

## Product status

This repository is a **frontend boilerplate**, not a finished product. Product
positioning, personas, and business workflows are not finalized and must not be
invented by the frontend.

## Implemented product surface

- Generic public landing page (`/`).
- Authentication flows: `/login`, `/register`.
- Authenticated proof surface: `/profile` (shows the current user).

## Not implemented

- User personas and detailed workflows.
- Dashboards, analytics, reports, or pricing.
- Any business feature beyond authentication.

The current surface exists to prove the auth/session foundation only.

## Business rules and enforcement

| Rule | Enforcement |
|---|---|
| Unauthenticated users are redirected to login from protected pages | Client-side guard in `(dashboard)/profile/page.tsx` |
| Authenticated users are redirected away from `/login` | `(auth)/login/page.tsx` checks `useAuthStore` status |
| Access token expiry triggers refresh without user intervention | Single-flight refresh in `src/lib/api/client.ts` |
| Terminal auth errors force logout + redirect | `handleQueryError` in `src/lib/api/queries.ts` |

All rules are client-side; the backend independently enforces its own security
boundary.

## Terminology

| Term | Definition |
|---|---|
| **Access Token** | Short-lived credential stored in-memory in `useAuthStore` |
| **Refresh Token** | Persistent credential in an HttpOnly cookie, managed by the backend |
| **Session Bootstrap** | Process of restoring user state on app mount via `/api/v1/auth/refresh` |
| **ApiResponse envelope** | Standard response shape `{ success, message, data, code?, error? }` |
| **Single-flight refresh** | Merging concurrent refresh requests into one shared promise |
| **authClient** | Credentialed Axios client (`withCredentials: true`) for auth endpoints |
| **apiClient** | Bearer token Axios client with unwrap and single-flight refresh |
| **Query defaults** | Per-domain TanStack Query defaults in `src/lib/api/queries.ts` |

# API Overview

API integration documentation for communication between the Next.js frontend
and the Go Fiber backend.

## Contract summary

- Backend base URL is configured via `NEXT_PUBLIC_BACKEND_API_URL`
  (see `.env.example`, default `http://localhost:8080`).
- Endpoint paths carry the `/api/v1/...` prefix (e.g. `/api/v1/auth/login`).
- Every response uses the `ApiResponse<T>` envelope
  (`src/types/api.types.ts`).
- Axios clients are defined in `src/lib/api/client.ts`:
  - `authClient` - credentialed (`withCredentials: true`) for auth endpoints.
  - `apiClient` - Bearer token client with single-flight refresh and
    `response.data.data` unwrap.

## Backend contract

The API contract is owned by the backend repository
(`fiber-boilerplate`, a Go Fiber service). See:

- [Backend API overview](../../../../Backend/fiber-boilerplate/docs/api/overview.md)
- [Backend authentication & token flow](../../../../Backend/fiber-boilerplate/docs/api/authentication.md)

Endpoint paths and error codes in this repo must stay in sync with the backend
routes (`src/modules/auth/auth.controller.go`) and error codes
(`docs/api/authentication.md` there).

## Related documents

- [Authentication & Errors](./authentication.md) - Endpoint list, envelope,
  and error codes.

## Axios clients

- **`authClient`** - credentialed client (`withCredentials: true`) for
  authentication endpoints.
- **`apiClient`** - Bearer token client for business endpoints. Reads the
  access token from `useAuthStore` and sets `Authorization: Bearer <token>`.

### Interceptors

- `apiClient` request interceptor attaches the Bearer token from the store.
- `apiClient` response interceptor:
  1. Unwraps the envelope: returns `response.data.data` when present.
  2. On `401` with code `ACCESS_TOKEN_EXPIRED` (and not already retried),
     triggers a single-flight refresh, then retries the original request.
  3. On refresh failure, clears the session and redirects to `/login`.

### Single-flight refresh

```text
concurrent 401s -> one shared refreshAccessToken() promise -> all callers retry
```

Implemented with a module-level `refreshPromise` in `client.ts`. The refresh
call itself goes through `authClient` (`POST /api/v1/auth/refresh`), updates the
store, and returns the new access token. The `_retry` flag prevents infinite
retry loops.

## Query configuration

Defined in `src/lib/api/queries.ts`.

- `queryDefaults` - per-domain defaults for auth, data, lists, and profile
  (gcTime, staleTime, retry, refetchOnWindowFocus).
- `queryClientConfig` - defaultOptions wired into `QueryProvider`.
- `invalidateAuthQueries` / `clearAuthQueries` - invalidate or remove auth and
  profile query keys on session changes.
- `handleQueryError` - maps terminal auth errors to logout + redirect.

Query keys live in `src/lib/api/query-keys.ts` (`auth.session`,
`user.profile`).

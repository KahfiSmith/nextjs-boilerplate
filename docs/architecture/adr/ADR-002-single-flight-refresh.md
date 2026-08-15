# ADR-002: Single-Flight Token Refresh in the Axios Interceptor

## Context

The frontend keeps the access token in memory, so it expires (15m by default)
and must be refreshed via the HttpOnly refresh cookie. When several requests
are in flight simultaneously and the token expires, each one would receive a
`401 ACCESS_TOKEN_EXPIRED` and independently trigger `POST /auth/refresh`.
Options:

- Each 401 triggers its own refresh — N concurrent requests cause N refresh
  calls, racing the backend's atomic rotation and burning the cookie.
- A module-level shared refresh promise — the first 401 starts one refresh; all
  concurrent 401s await the same promise and then retry once.

## Decision

- `apiClient` (`src/lib/api/client.ts`) owns a response interceptor.
- On `401` with code `ACCESS_TOKEN_EXPIRED` (and `_retry` not already set), the
  interceptor calls a single shared `refreshAccessToken()`.
- `refreshAccessToken` memoizes the in-flight refresh in a module-level
  `refreshPromise`; concurrent callers share it.
- After the shared refresh resolves, the original request is retried once with
  the new Bearer token.
- If refresh fails, the session is cleared and the user is redirected to
  `/login`.

## Consequences

- Exactly one refresh call happens for a burst of concurrent 401s.
- The retry flag (`_retry`) prevents infinite retry loops.
- Refresh failures end the session client-side, matching the backend's
  terminal auth error handling.

## Status

Accepted.

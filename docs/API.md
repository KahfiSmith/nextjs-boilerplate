# API Documentation & Contracts

The browser communicates directly with the Go Fiber backend configured by `NEXT_PUBLIC_BACKEND_API_URL` (local default: `http://localhost:8080`). The backend base prefix is `/api/v1`.

## Authentication Architecture
- **Access token:** Short-lived JWT returned in JSON and held only in the non-persisted Zustand store.
- **Refresh token:** Opaque token stored by the backend in an HttpOnly cookie named `refresh_token` in development. The browser sends it automatically; JavaScript cannot read it.
- **Credentials:** `authClient` uses `withCredentials: true` for login, refresh, and logout. `apiClient` sends Bearer access tokens for protected business requests; register also uses `apiClient`.
- **Refresh handling:** `apiClient` retries one request after `401 ACCESS_TOKEN_EXPIRED`; concurrent refreshes share one promise.

## Active frontend auth flow

| Operation | Endpoint | Frontend status |
|---|---|---|
| Register | `POST /api/v1/auth/register` | Active |
| Login | `POST /api/v1/auth/login` | Active |
| Bootstrap/refresh session | `POST /api/v1/auth/refresh` | Active |
| Logout | `POST /api/v1/auth/logout` | Active |
| Forgot/reset password | `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password` | Endpoint constants reserved |
| Verify/resend email | `POST /api/v1/auth/verify-email`, `POST /api/v1/auth/resend-verification` | Endpoint constants reserved |
| Delete account | `DELETE /api/v1/auth/account` | Endpoint constant reserved |

## Request contracts

### Login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Register
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

The backend requires a name of at least 2 characters and a registration password of at least 8 characters. The frontend mirrors these constraints (login password is also validated at 8 characters minimum).

> **Note:** Login is currently the only flow that stores the session and redirects (`router.replace` to `redirectTo || /profile`). Registration posts to the API via `apiClient` and navigates to `/login` on success without establishing a session.

### Refresh and logout
Both use `POST` with no request body. The browser supplies the refresh cookie. Logout is idempotent on the backend.

## Success envelope

Auth success responses use:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "<jwt-access-token>",
    "expires_in": 900,
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "is_email_verified": false
    }
  }
}
```

Registration returns `201` and includes `data.user`; it does not establish a session. The current-user endpoint returns `data` containing `id`, `email`, `role`, and `is_email_verified`.

> **Note:** The `success`, `message`, and `data` keys mirror `ApiResponse<T>` in `src/types/auth.types.ts`. The example above is the minimal shape; the response type also allows an optional `code` and `error`. No contract-conformance test currently exists — any response that does not match this shape will be treated as `data` by the API layer's normalization.

## Error envelope

Backend errors use:
```json
{
  "success": false,
  "code": "ACCESS_TOKEN_EXPIRED",
  "message": "Access token has expired",
  "error": "Access token has expired"
}
```

> **Note:** This mirrors `ApiResponse<T>` — `error` is typed as `unknown`, so its exact shape is not enforced by the frontend. The retry-once logic in `apiClient` triggers specifically on `401` with `code === "ACCESS_TOKEN_EXPIRED"`, so that pairing must stay consistent.

Relevant auth codes include `ACCESS_TOKEN_MISSING`, `ACCESS_TOKEN_INVALID`, `ACCESS_TOKEN_EXPIRED`, `REFRESH_TOKEN_MISSING`, `REFRESH_TOKEN_INVALID`, `REFRESH_TOKEN_EXPIRED`, `REFRESH_TOKEN_REUSED`, `SESSION_REVOKED`, and `INVALID_CREDENTIALS`.

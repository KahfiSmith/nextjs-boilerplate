# Authentication API & Errors

All endpoints are defined in `src/lib/api/endpoints.ts`. Calls go through
`authClient` (credentialed, `withCredentials: true`) unless noted.

## Endpoints

| Method | Path | Client | Purpose | Wired in UI |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/login` | `authClient` | Authenticate user credentials | `LoginForm` → `useLogin` |
| `POST` | `/api/v1/auth/register` | `apiClient` | Create new user account | `RegisterForm` → `useRegister` |
| `POST` | `/api/v1/auth/refresh` | `authClient` | Refresh access token via HttpOnly cookie | `SessionProvider` bootstrap + single-flight retry |
| `POST` | `/api/v1/auth/logout` | `authClient` | Revoke session and clear cookies | `LogoutButton` → `useLogout` |
| `POST` | `/api/v1/auth/forgot-password` | `authClient` | Request password reset email | Defined, not wired |
| `POST` | `/api/v1/auth/reset-password` | `authClient` | Reset password with token | Defined, not wired |
| `POST` | `/api/v1/auth/verify-email` | `authClient` | Verify email address | Defined, not wired |
| `POST` | `/api/v1/auth/resend-verification` | `authClient` | Resend email verification | Defined, not wired |
| `DELETE` | `/api/v1/auth/account` | `apiClient` | Delete user account | `DeleteAccountButton` → `useDeleteAccount` |
| `GET` | `/api/v1/auth/me` | `apiClient` | Fetch current user profile | Defined, not wired |

## Usage map

| Endpoint | Hook | Component / Provider |
|---|---|---|
| login | `useLogin` (`src/hooks/auth/use-login.ts`) | `LoginForm` |
| register | `useRegister` (`src/hooks/auth/use-register.ts`) | `RegisterForm` |
| refresh | `refreshAccessToken` (`src/lib/api/client.ts`) | `SessionProvider` |
| logout | `useLogout` (`src/hooks/auth/use-logout.ts`) | `LogoutButton` |
| delete-account | `useDeleteAccount` (`src/hooks/auth/use-delete-account.ts`) | `DeleteAccountButton` |

`register` and `me` use `apiClient` (Bearer, no credentials cookie). The
remaining endpoints are part of the contract but have no UI flow yet.

## Error format

### Envelope

Every response uses `ApiResponse<T>` defined in `src/types/auth.types.ts`:

```ts
interface ApiResponse<T = unknown> {
  code?: string;
  data: T;
  error?: unknown;
  message: string;
  success: boolean;
}
```

### Example failure

```json
{
  "success": false,
  "message": "Access token has expired",
  "code": "ACCESS_TOKEN_EXPIRED"
}
```

### Behavior

- **Success responses** include `data` (the payload) plus `success` and
  `message`.
- **Failure responses** include `code` and may include `error`; both fields are
  optional per the type.
- `apiClient` unwraps the envelope on success and returns `response.data.data`.
- Auth error codes are centralized in `src/lib/api/auth-error-codes.ts`:

| Code | Meaning | Produced by backend |
|---|---|---|
| `ACCESS_TOKEN_EXPIRED` | Access token expired; triggers single-flight refresh | yes |
| `ACCESS_TOKEN_INVALID` | Access token invalid | yes |
| `ACCESS_TOKEN_MISSING` | Access token missing | yes |
| `ACCOUNT_DISABLED` | Account disabled; treated as session loss | no (defensive) |
| `FORBIDDEN` | Forbidden | yes |
| `INVALID_CREDENTIALS` | Wrong email/password | yes |
| `REFRESH_TOKEN_EXPIRED` | Refresh token expired; forces logout | yes |
| `REFRESH_TOKEN_INVALID` | Refresh token invalid | yes |
| `REFRESH_TOKEN_MISSING` | Refresh token missing | yes |
| `REFRESH_TOKEN_REUSED` | Refresh token reuse detected; forces logout | yes |
| `SESSION_REVOKED` | Session revoked; forces logout | yes |
| `UNAUTHORIZED` | Default unauthorized | yes |
| `VALIDATION_ERROR` | Request validation failed | yes |

> `ACCOUNT_DISABLED` is handled defensively by `handleQueryError` but is not
> currently produced by the backend. The authoritative backend error-code list
> lives in the backend repo:
> [Backend error codes](../../../../Backend/fiber-boilerplate/docs/api/overview.md).

### Client-side mapping

`handleQueryError` (`src/lib/api/queries.ts`) maps terminal auth errors
(`REFRESH_TOKEN_EXPIRED`, `REFRESH_TOKEN_REUSED`, `SESSION_REVOKED`,
`ACCOUNT_DISABLED`) to clearing auth queries, clearing the session, and
redirecting to `/login`. Other errors are logged in development only.

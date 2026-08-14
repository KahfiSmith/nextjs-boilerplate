# Data Flow

## Request flow

```text
User action
  -> component handler (form submit)
     -> hook mutation (useLogin / useRegister / useLogout)
        -> Axios client (authClient or apiClient)
           -> Go Fiber backend (POST /api/v1/auth/...)
              -> response envelope (ApiResponse<T>)
                 -> interceptor unwraps to response.data.data (apiClient only)
                    -> Zustand store update (auth-store)
                       -> UI re-render + redirect
```

## Notes

1. User actions trigger component state / handlers.
2. Forms validate inputs via `src/lib/schemas` (Zod + `@hookform/resolvers/zod`)
   before any API transport.
3. Client API requests execute through `authClient` or `apiClient`
   (`src/lib/api`):
   - `authClient` (withCredentials) for authentication endpoints.
   - `apiClient` for business endpoints with Bearer token and single-flight
     refresh on `401 ACCESS_TOKEN_EXPIRED`.
4. `apiClient` unwraps the backend envelope on success and returns
   `response.data.data`.
5. Auth sessions maintain in-memory state in `useAuthStore` (Zustand).
6. Refresh token flow runs transparently via HttpOnly cookies and single-flight
   execution.

## Rendering

- The root layout mounts `AppProvider` → `QueryProvider` → `SessionProvider`.
- On mount, `SessionProvider` calls `POST /api/v1/auth/refresh` to restore the
  in-memory session.
- Pages read `useAuthStore` status and redirect accordingly (client-side
  guards).

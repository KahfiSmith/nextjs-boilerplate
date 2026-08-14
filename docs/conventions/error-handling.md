# Error Handling & Logging

## Error handling

### Current error paths

- **Standard envelope parsing** via Axios interceptors (`src/lib/api/client.ts`):
  success responses unwrap to `response.data.data`; failures flow to error
  handlers.
- **`ApiError`** (`src/lib/api/error-handler.ts`) - typed error with `status`
  and optional `payload`; `toApiErrorMessage` maps unknown errors to a safe
  human-readable message.
- **Form submissions** use `toast.promise` (sonner) for loading/success/error
  feedback (`LoginForm`, `RegisterForm`).
- **Query errors** (`handleQueryError` in `src/lib/api/queries.ts`): terminal
  auth codes clear auth state and redirect to `/login`; other errors log in
  development only.

### Rules

- No exposed raw error stacks.
- Safe human-readable message mapping before UI rendering.
- Never log secrets, passwords, or tokens.

## Logging

### Current behavior

- `eslint.config.mjs` sets `no-console` to warn.
- `handleQueryError` logs query errors only when
  `process.env.NODE_ENV === "development"`.
- UI feedback uses sonner toasts rather than console output.

### Rules

- `console.error` strictly for actionable failures.
- Never log secrets, passwords, or access/refresh tokens.
- No logging library is installed; keep logging minimal and intentional.

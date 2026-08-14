# Debugging Guide

## Verify the environment first

- `NEXT_PUBLIC_BACKEND_API_URL` in `.env.local` must point at a running backend
  (default `http://localhost:8080`).
- Backend CORS must allow the frontend origin (`http://localhost:3000`) and
  credentials.

## Common checks

- **React DevTools** - inspect component props/state; confirm `useAuthStore`
  status transitions (`idle → checking → authenticated/unauthenticated`).
- **Browser Network tab** - verify:
  - `POST /api/v1/auth/refresh` is sent on mount (session bootstrap).
  - The `HttpOnly` cookie is present on credentialed requests.
  - `Authorization: Bearer <token>` is attached by `apiClient`.
- **React Query Devtools** - inspect query keys and cache behavior
  (`auth.session`, `user.profile`).
- **Next.js Turbopack logs** - terminal output for compile/runtime errors.

## Common failure modes

| Symptom | Likely cause |
|---|---|
| `/login` stuck on "Checking session..." | Refresh request never resolves; backend down or CORS misconfigured |
| 401 loop | Refresh cookie missing/invalid; single-flight retry failing; check Network tab |
| CORS errors in console | Backend not allowing `localhost:3000` with credentials |
| Redirect loops | `useAuthStore` status flapping; check state in React DevTools |
| Console errors only in dev | `handleQueryError` logs only when `NODE_ENV === "development"` |

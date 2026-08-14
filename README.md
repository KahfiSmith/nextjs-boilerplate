# Next.js Boilerplate

Opinionated Next.js App Router starter integrated with Go Fiber backend authentication.

## Security & Auth Architecture

- **Access Token**: In-memory only via non-persisted Zustand store (`useAuthStore`).
- **Refresh Token**: Managed via `HttpOnly` secure cookies sent directly by the Go Fiber backend. JavaScript cannot access the refresh token.
- **Session Bootstrap**: On application mount, `SessionProvider` triggers `POST /api/v1/auth/refresh` using `authClient` (`withCredentials: true`) to restore the in-memory access token.
- **Single-Flight Refresh**: Concurrent `401 ACCESS_TOKEN_EXPIRED` requests are merged into a single shared refresh promise via `refreshAccessToken()`.
- **Axios Clients**: `authClient` (for auth endpoints with credentials) and `apiClient` (for business endpoints with Bearer tokens).

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Quality Checks

```bash
pnpm lint
pnpm type-check
pnpm docs:check
pnpm build
```

## Documentation

- [Documentation index](docs/README.md) - Architecture, API, security, conventions, development, and more.
- A pre-commit hook runs `pnpm docs:check` automatically to keep docs in sync with the code.

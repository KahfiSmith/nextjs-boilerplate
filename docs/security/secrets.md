# Secrets Management & Security Rules

## Secrets

### Rules

- Secrets must never be prefixed with `NEXT_PUBLIC_`.
- Public configurations live in `.env.example`.
- Sensitive local credentials are stored in `.env.local` (git-ignored).
- Never commit secrets.

### Environment variables

| Variable | Public | Default | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_BACKEND_API_URL` | yes | `http://localhost:8080` | Backend base URL; read by the Axios clients |

No server-only secrets exist in this repository yet. When one is added, it must
be a non-prefixed variable and must never appear in client bundles.

## Security rules and enforcement

1. Never commit secrets.
2. Never log credentials or tokens.
3. Validate user input with Zod prior to API call.

| Rule | Where it lives |
|---|---|
| Never commit secrets | `.gitignore` for `.env.local`; `.env.example` holds only public vars |
| Never log credentials/tokens | `eslint.config.mjs` `no-console` warn; `handleQueryError` logs only in development |
| Validate input with Zod | `src/lib/schemas/auth.schema.ts` + `@hookform/resolvers/zod` in forms |

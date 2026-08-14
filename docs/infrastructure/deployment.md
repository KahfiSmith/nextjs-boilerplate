# Deployment & Environments

## Environments

### Environment variables

| Variable | Public | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_BACKEND_API_URL` | yes | `http://localhost:8080` | Go Fiber backend base URL |

Defined in `.env.example`; copy to `.env.local` for local development.

### Topologies

| Environment | Frontend | Backend |
|---|---|---|
| Development (host) | `http://localhost:3000` | `http://localhost:8080` |
| Development (docker-compose) | `http://localhost:3000` | `http://localhost:3000` |
| Production | Deployment platform URL | Configured via platform env vars |

The backend repo (`fiber-boilerplate`) supports two run modes: host
(`APP_PORT=8080`) and docker-compose (port `3000`). `NEXT_PUBLIC_BACKEND_API_URL`
must match the active backend mode. See
[backend deployment](../../../../Backend/fiber-boilerplate/docs/infrastructure/deployment.md).

Production variables are set via platform settings (Vercel / Node host). The
backend URL must be reachable from the browser and must allow the frontend
origin with credentials (CORS).

## Deployment

### Build and start

```bash
pnpm build
pnpm start
```

### Notes

- This is a Next.js application with no server-side routes
  (`src/app/api/**` does not exist); all routes are client components.
- Deploy to Vercel or a Node.js container running `pnpm start`.
- Set `NEXT_PUBLIC_BACKEND_API_URL` to the production backend URL.

## CI/CD

### Current status

CI is configured via `.github/workflows/ci.yml` and runs on every push/PR:

1. Install dependencies (`pnpm install --frozen-lockfile`).
2. ESLint checks (`pnpm lint`).
3. TypeScript type checks (`pnpm type-check`).
4. Docs validation (`pnpm docs:check`).
5. Production build verification (`pnpm build`).
6. Risk classification (`pnpm verify:risk`).

### Cross-repo check

`pnpm verify:cross-repo` validates FE↔BE sync locally (endpoints, error codes,
doc links) against the sibling backend repo. It is not run in CI by default;
enable it by checking out the sibling repo in the workflow.

# Developer Setup & Commands

## Prerequisites

- Node.js 20+
- pnpm 10.x (`package.json` pins `packageManager: pnpm@10.33.0`)

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

- `pnpm dev` runs Next.js with Turbopack.

## Environment

The only required variable is `NEXT_PUBLIC_BACKEND_API_URL`
(default `http://localhost:8080`). Point it at a running Go Fiber backend
(`fiber-boilerplate`); otherwise the app loads but auth requests will fail.

Backend run modes:

- **Host mode**: `http://localhost:8080` (backend `APP_PORT=8080`).
- **docker-compose mode**: `http://localhost:3000` (backend compose overrides the port).

Set `NEXT_PUBLIC_BACKEND_API_URL` to match the active mode. The backend
`FRONTEND_ORIGIN` must allow `http://localhost:3000` (this frontend).

## Verify it works

1. Open `http://localhost:3000` - the public landing page renders.
2. Visit `/register` and `/login` - forms render with Zod validation.
3. Without a backend, `/login` and `/profile` show the "Checking session..."
   state; with a backend, sign in redirects to `/profile`.

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the Next.js dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | ESLint over `src`, `*.ts`, `*.mjs` |
| `pnpm lint:fix` | ESLint with `--fix` |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm docs:check` | Validate docs stay in sync with the repo (links, `src/` paths, endpoints) |

## Notes

- There is no `pnpm test` script yet (see
  [Testing Conventions](../conventions/testing.md)).
- `pnpm build` verifies the app compiles for production.
- A pre-commit hook runs `pnpm docs:check` automatically (configured via
  `core.hooksPath` → `.githooks/pre-commit`).

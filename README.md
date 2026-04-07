# Next.js Boilerplate

Opinionated Next.js App Router starter for teams that want strict TypeScript, a layered frontend structure, and an auth-oriented foundation without starting from zero.

## Overview

The repository is currently in a transition state: the route structure, env handling, and UI primitives are in place, but several planned modules are still empty placeholders.

What is active today:

- Next.js `16.1.6` with App Router and React `19`
- Tailwind CSS `v4` with shadcn-style component setup
- Public route group in `src/app/(public)`
- Protected route group in `src/app/(protected)`
- Root layout and app-level error boundary
- Auth env parsing in `src/config/env.ts`
- Middleware guard for `/` when `AUTH_STRATEGY=nextauth`
- Shared UI primitive `Button` and common loading/not-found components

What is not implemented yet:

- Active route handlers under `src/app/api`
- Working auth runtime in `auth.ts` or `src/lib/auth/*`
- Non-empty service implementations in `src/services/*`
- Wired providers in `src/providers/*`
- Shared API client logic in `src/lib/api/*`

## Tech Stack

| Category | Stack |
| --- | --- |
| Framework | Next.js `16.1.6` |
| UI Runtime | React `19.2.4` / React DOM `19.2.4` |
| Language | TypeScript `strict` |
| Styling | Tailwind CSS `v4` |
| UI Utilities | `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `framer-motion` |
| Forms | React Hook Form, `@hookform/resolvers` |
| Validation | Zod |
| Data and Fetching | Native `fetch`, `axios`, TanStack Query |
| Auth | `next-auth` is installed, but current auth runtime files are still placeholders |
| Testing | Jest |
| Linting | ESLint |

## Current App Surface

Current routes based on `src/app`:

- `/login` via `src/app/(public)/login/page.tsx`
- `/register` via `src/app/(public)/register/page.tsx`
- `/` via `src/app/(public)/page.tsx` but the page file is currently empty
- `/profile` via `src/app/(protected)/profile/page.tsx` but the page file is currently empty

Behavior notes:

- `/login` redirects to `/` when `getAuthSession()` returns a session
- `/register` is an informational page explaining external-backend registration flow
- `middleware.ts` only matches `/`
- There are no active API endpoints in `src/app/api`

## Installation

### Requirements

- Node.js `20+`
- pnpm `10+`

### Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
pnpm dev
```

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm type-check
pnpm test
pnpm test:watch
```

## Environment Configuration

Core values from `.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

AUTH_STRATEGY=nextauth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me-to-a-long-random-secret
# Used only when AUTH_STRATEGY=nextauth
AUTH_MODE=external
BACKEND_API_URL=http://localhost:8080
BACKEND_AUTH_LOGIN_PATH=/api/auth/login
BACKEND_AUTH_TIMEOUT_MS=8000

# Demo mode fallback (used only when AUTH_STRATEGY=nextauth and AUTH_MODE=demo)
AUTH_DEMO_NAME=Demo User
AUTH_DEMO_EMAIL=demo@example.com
AUTH_DEMO_PASSWORD=demo12345

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_boilerplate
```

Current env usage:

- `src/config/env.ts` is the only non-empty config module
- `AUTH_STRATEGY` supports `nextauth`, `external`, and `none`
- `AUTH_MODE` supports `external` and `demo`
- `NEXTAUTH_SECRET` is required only when `AUTH_STRATEGY=nextauth`
- `DATABASE_URL` exists in `.env.example`, but no database integration is wired yet

## Project Structure

```text
.
├─ docs/
├─ public/
│  ├─ fonts/
│  ├─ icons/
│  └─ images/
├─ src/
│  ├─ __tests__/
│  ├─ app/
│  │  ├─ (protected)/
│  │  ├─ (public)/
│  │  ├─ error.tsx
│  │  ├─ globals.css
│  │  └─ layout.tsx
│  ├─ components/
│  │  ├─ common/
│  │  ├─ features/
│  │  └─ ui/
│  ├─ config/
│  ├─ hooks/
│  ├─ lib/
│  │  ├─ api/
│  │  ├─ auth/
│  │  └─ utils/
│  ├─ providers/
│  ├─ services/
│  ├─ store/
│  └─ types/
├─ auth.ts
├─ middleware.ts
└─ package.json
```

### Responsibility Guide

- `src/app`: route boundaries, layouts, and route-level UI
- `src/components/common`: shared page-level UI such as loading and not-found components
- `src/components/ui`: reusable UI primitives
- `src/components/features`: feature-level UI composition
- `src/config`: app configuration modules; only `env.ts` is active today
- `src/services`: intended business-logic layer; current files are placeholders
- `src/lib/api`: intended frontend API helper layer; current files are placeholders
- `src/lib/auth`: intended auth helper layer; current files are placeholders
- `src/providers`: reserved for client providers; current files are placeholders
- `src/store`: reserved for client-side state; current file is placeholder

## Testing and Verification Notes

- `pnpm lint`, `pnpm type-check`, and `pnpm test` are the standard quality checks
- The current Jest example in `src/__tests__/health-route.test.ts` still imports `@/app/api/health/route`, but that route file no longer exists
- Treat the current test suite as out of sync until the API surface or the test is updated

## Documentation

Use these docs as the source of truth when extending the boilerplate:

- `docs/rules.md`
- `docs/coding-standards.md`
- `docs/api.md`
- `docs/architecture.md`
- `docs/database.md`
- `docs/patterns.md`
- `docs/workflow.md`

## Notes

- This boilerplate currently describes a target architecture more than a finished feature set.
- Several files are intentionally present as placeholders; do not assume a directory is active just because it exists.
- If you add active API routes, auth runtime, or persistence code, update the related docs in `docs/` immediately.

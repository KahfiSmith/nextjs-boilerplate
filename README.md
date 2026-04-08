# Next.js Boilerplate

Opinionated Next.js App Router starter for teams that want strict TypeScript, a layered frontend structure, and an auth-oriented foundation without starting from zero.

## Overview

The repository now has a usable baseline for route groups, cookie-backed auth bootstrap, providers, hooks, store, and shared API utilities. The architecture is still intentionally small, but the core app shell is no longer placeholder-only.

What is active today:

- Next.js `16.1.6` with App Router and React `19`
- Tailwind CSS `v4` with shadcn-style component setup
- Public route group in `src/app/(public)`
- Protected route group in `src/app/(protected)`
- Root layout and app-level error boundary
- Cookie-backed auth bootstrap in `auth.ts` and `src/lib/auth/*`
- App provider composition in `src/providers/*`
- Shared hooks and auth store in `src/hooks/*` and `src/store/*` with Zustand
- Shared UI primitive `Button` and common layout components

What is not implemented yet:

- Active route handlers under `src/app/api`
- Non-empty service implementations in `src/services/*`
- Backend-integrated auth contract or real NextAuth adapter flow
- Feature-specific API routes that consume `src/lib/api/*`

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
| Client State | Zustand |
| Auth | Lightweight cookie-backed bootstrap session flow, with `next-auth` available for later integration |
| Testing | Jest |
| Linting | ESLint |

## Current App Surface

Current routes based on `src/app`:

- `/login` via `src/app/(public)/login/page.tsx`
- `/register` via `src/app/(public)/register/page.tsx`
- `/` via `src/app/(public)/page.tsx`
- `/profile` via `src/app/(protected)/profile/page.tsx`

Behavior notes:

- `/login` redirects to `/profile` when a session cookie already exists
- `/profile` is protected by middleware and server-side session checks
- `/register` now renders a dedicated feature component
- `middleware.ts` matches `/login` and `/profile/:path*`
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
- `src/components/common`: shared page-level UI such as header, footer, loading, and not-found components
- `src/components/ui`: reusable UI primitives
- `src/components/features`: feature-level UI composition
- `src/config`: app configuration modules for env, routes, navigation, and site metadata
- `src/services`: intended business-logic layer; current files are placeholders
- `src/lib/api`: shared API client, query-key, and error helper layer
- `src/lib/auth`: cookie session serialization, permissions, and auth metadata helpers
- `src/providers`: app, query, session, and theme providers
- `src/store`: lightweight client-state store layer powered by Zustand

Import note:

- Prefer folder-level imports such as `@/config`, `@/store`, `@/hooks`, `@/lib/auth`, `@/lib/utils`, and `@/components/ui` when the folder already exposes a deliberate `index.ts`.
- Do not introduce a single root barrel for the whole repository.

## Testing and Verification Notes

- `pnpm lint`, `pnpm type-check`, and `pnpm test` are the standard quality checks
- `src/__tests__/auth-session.test.ts` covers cookie session serialization and expiry parsing
- Current lint is clean after removing the previous warning in `src/app/error.tsx`

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

- This boilerplate now has a minimal but functional auth bootstrap instead of empty auth scaffolding.
- Service and API route layers are still intentionally thin and should grow only when a feature actually needs them.
- If you add active API routes, auth runtime, or persistence code, update the related docs in `docs/` immediately.

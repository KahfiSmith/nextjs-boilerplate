# Next.js Boilerplate

Opinionated Next.js App Router starter for teams that want strict TypeScript, a layered frontend architecture, and an auth-ready foundation without starting from zero.

## Overview

This repository gives you a production-oriented frontend baseline with:

- App Router-first structure for pages and APIs
- Strictly typed React and server code
- Tailwind CSS v4 with reusable UI primitives
- Auth-ready flows with switchable runtime strategies
- Clear service and repository boundaries for future scale
- Basic testing and linting already wired

## Tech Stack

| Category | Stack |
| --- | --- |
| Framework | Next.js `16.1.6` |
| UI Runtime | React `19` / React DOM `19` |
| Language | TypeScript `strict` |
| Styling | Tailwind CSS `v4` |
| UI Utilities | `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `framer-motion` |
| Forms | React Hook Form, `@hookform/resolvers` |
| Validation | Zod |
| Data Fetching | TanStack Query |
| Auth | NextAuth (`next-auth`) with external-backend or demo credential modes |
| Testing | Jest |
| Linting | ESLint |

## Features

- Auth-ready setup with three runtime strategies:
  - `nextauth`
  - `external`
  - `none`
- Credentials login page at `/auth/login`
- Registration guidance page at `/auth/register`
- Health check endpoint at `/api/health`
- Layered structure across route handlers, services, repositories, schemas, and UI
- Reusable primitive components in `src/components/ui`
- Feature-scoped composition in `src/components/features`
- App-level loading, error, and not-found states already scaffolded
- API contract and architecture docs kept in `docs/`

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

## Usage Guide

### Run locally

```bash
pnpm dev
```

The dev server runs with Turbopack.

### Build for production

```bash
pnpm build
pnpm start
```

### Run quality checks

```bash
pnpm lint
pnpm type-check
pnpm test
```

### Explore the current app surface

- `/` shows the current auth-aware home screen
- `/auth/login` provides credential sign-in
- `/auth/register` explains the registration flow
- `/api/health` returns:

```json
{ "data": { "status": "ok" } }
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

### Auth behavior

- `AUTH_STRATEGY=nextauth` enables NextAuth route handling and protected runtime behavior
- `AUTH_STRATEGY=external` disables NextAuth runtime behavior and assumes auth is handled by an external backend
- `AUTH_STRATEGY=none` disables auth checks entirely
- `AUTH_MODE=external` delegates credential verification to `BACKEND_API_URL + BACKEND_AUTH_LOGIN_PATH`
- `AUTH_MODE=demo` verifies credentials against demo values in env

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

## Project Structure

```text
.
├─ docs/
├─ public/
├─ src/
│  ├─ __tests__/
│  ├─ app/
│  │  ├─ (auth)/
│  │  ├─ (public)/
│  │  └─ api/
│  ├─ components/
│  │  ├─ features/
│  │  └─ ui/
│  ├─ config/
│  ├─ hooks/
│  ├─ lib/
│  │  ├─ api/
│  │  ├─ auth/
│  │  ├─ clients/
│  │  ├─ repositories/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  └─ utils/
│  ├─ providers/
│  └─ types/
├─ middleware.ts
└─ package.json
```

### Responsibility guide

- `src/app` and `src/app/api`: route boundaries only
- `src/components/ui`: reusable presentation primitives
- `src/components/features`: use-case UI composition
- `src/hooks`: reusable client hooks and query helpers
- `src/lib/services`: business logic
- `src/lib/repositories`: persistence and external integration
- `src/lib/schemas`: request and response validation
- `src/lib/clients`: external API callers

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

- Database tooling is intentionally not installed by default.
- `next-auth` is wired only for the `nextauth` strategy.
- `external` and `none` are runtime configuration modes, not separate app builds.
- This boilerplate is optimized for incremental growth, not maximum abstraction on day one.

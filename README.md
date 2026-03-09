# Next.js Boilerplate

Opinionated Next.js 16 App Router starter with TypeScript strict mode, Tailwind CSS v4, a shadcn-style UI layer, and a layered auth-ready architecture.

## What Is Included

- Next.js `16.1.6` with App Router
- React `19`
- TypeScript `strict`
- Tailwind CSS `v4`
- TanStack Query
- React Hook Form
- `@hookform/resolvers`
- Zod
- ESLint + Jest
- Reusable UI primitives in `src/components/ui`
- Feature composition in `src/components/features`
- Service and repository layers for auth flow
- Optional auth runtime controlled by env:
  - `nextauth`
  - `external`
  - `none`

## Requirements

- Node.js `20+`
- pnpm `10+`

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

For Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

## Environment

Core env values from `.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

AUTH_STRATEGY=nextauth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me-to-a-long-random-secret

AUTH_MODE=external
BACKEND_API_URL=http://localhost:8080
BACKEND_AUTH_LOGIN_PATH=/api/auth/login
BACKEND_AUTH_TIMEOUT_MS=8000

AUTH_DEMO_NAME=Demo User
AUTH_DEMO_EMAIL=demo@example.com
AUTH_DEMO_PASSWORD=demo12345

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_boilerplate
```

Behavior:

- `AUTH_STRATEGY=nextauth`: enables NextAuth route handling and middleware protection for `/`
- `AUTH_STRATEGY=external`: disables NextAuth runtime behavior in middleware; frontend shows external-backend guidance
- `AUTH_STRATEGY=none`: disables auth checks
- `AUTH_MODE=external`: credential verification is delegated to `BACKEND_API_URL + BACKEND_AUTH_LOGIN_PATH`
- `AUTH_MODE=demo`: credentials are verified against demo env values

## Scripts

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

Notes:

- `pnpm dev` runs Next.js with Turbopack.
- Database tooling is not wired by default. Add Prisma or your chosen persistence layer when the project actually needs it.

## Active App Surface

Routes currently present:

- `/` home page showing current auth status
- `/auth/login` credentials sign-in page
- `/auth/register` backend-registration guidance page
- `/api/health` health check endpoint
- `/api/auth/[...nextauth]` NextAuth route entrypoint for `nextauth` strategy

Health response:

```json
{ "data": { "status": "ok" } }
```

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
│  │  ├─ (auth)/
│  │  ├─ (public)/
│  │  ├─ api/
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

Architecture rule of thumb:

- `src/app` and `src/app/api`: route boundaries only
- `src/app/(public)` and `src/app/(auth)`: route-group organization by intent without URL changes
- add groups such as `src/app/(dashboard)` when the signed-in app surface grows
- `src/components/ui`: reusable primitives
- `src/providers`: app-level client providers
- `src/components/features`: use-case UI
- `src/hooks`: reusable React hooks and TanStack Query wrappers
- `src/lib/api`: shared fetchers and internal API clients
- `src/lib/services`: business logic
- `src/lib/repositories`: persistence or external integration
- `src/lib/schemas`: Zod schemas for request and response validation
- `src/components/features`: preferred place for client-side form composition with React Hook Form
- `src/lib/clients`: external API callers

## Verification

Minimum recommended checks:

```bash
pnpm lint
pnpm type-check
pnpm test
```

## Documentation

Start here for project rules and implementation constraints:

- `docs/rules.md`
- `docs/coding-standards.md`
- `docs/api.md`
- `docs/architecture.md`
- `docs/database.md`
- `docs/patterns.md`
- `docs/workflow.md`

## Current Caveats

- Database tooling is intentionally not installed by default.
- `next-auth` is installed and wired for the `nextauth` strategy only; `external` and `none` intentionally change runtime behavior through env configuration.
- `src/hooks` is kept as a stable convention for reusable React hooks, including TanStack Query hooks.
- React Hook Form and `@hookform/resolvers` are installed for feature-level form state and schema-backed validation.

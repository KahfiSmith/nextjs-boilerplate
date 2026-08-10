# Architecture (Frontend Next.js Boilerplate)

This document defines architecture boundaries that must be preserved and clarifies which parts of the current repository are active versus still intentionally thin.

## Stack Baseline

- Next.js 16 with App Router
- React 19
- TypeScript strict
- Tailwind CSS v4
- React Hook Form
- `@hookform/resolvers`
- Zod
- shadcn-style component system
- Axios and TanStack Query installed for future client data flows
- Zustand for shared client-side state
- Testing: no test runner or test script is configured in the current repository

## Current Runtime Snapshot

Active today:

- `src/app/layout.tsx`
- `src/app/(public)/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(dashboard)/profile/page.tsx`
- `src/config/routes.ts`
- `src/config/site.ts`
- `src/lib/api/*`
- `src/lib/schemas/auth.schema.ts`
- `src/providers/*`
- `src/hooks/auth/*`
- `src/store/auth-store.ts`
- `src/components/features/auth/*`
- `src/components/ui/*`
- `src/components/common/*`

The frontend calls the backend directly; there are no active route handlers under `src/app/api`. The empty `src/app/api`, `src/lib/auth`, `src/lib/http`, and `src/lib/repositories` directories are reserved scaffold locations, not runtime dependencies.

## Directory Responsibilities

- `src/app/*`
  - Route segments, page and layout composition, metadata, and route-level error boundaries.
- `src/components/common/*`
  - Shared route-level UI such as loading or not-found screens.
- `src/components/ui/*`
  - Reusable UI primitives with no domain knowledge.
- `src/components/features/*`
  - Feature-level UI composition.
- `src/lib/services/*`
  - Intended business logic and use-case orchestration. Not active in the current repo.
- `src/lib/api/*`
  - Shared Axios clients, endpoint constants, query keys, refresh handling, and API error helpers.
- `src/lib/auth/*`, `src/lib/http/*`, and `src/lib/repositories/*`
  - Reserved locations only; currently empty and not active runtime dependencies.
- `src/lib/utils/*`
  - Shared low-level utilities such as class-name merging.
- `src/providers/*`
  - Optional client providers.
- `src/store/*`
  - Optional client state. The current auth store uses Zustand.
- `src/types/*`
  - Shared type contracts.
- `src/config/*`
  - Environment parsing and static configuration.

## Dependency Direction

Current intended direction:

`app -> components/features/common/ui -> services -> lib(api/auth/utils) -> types/config`

Rules:

- `components/ui` must not import service modules.
- Route files should not contain complex domain logic.
- Services must not depend on UI components.
- Providers and stores are optional infrastructure, not required layers for every feature.
- If you add `src/app/api`, keep handlers as HTTP boundaries only.

## Path Conventions

Use these default paths so future implementation stays consistent with the current tree:

- Public page: `src/app/(public)/<segment>/page.tsx`
- Auth page: `src/app/(auth)/<segment>/page.tsx`
- Dashboard/protected page: `src/app/(dashboard)/<segment>/page.tsx`
- Feature component: `src/components/features/<feature>/...`
- Common route UI: `src/components/common/<name>.tsx`
- UI primitive: `src/components/ui/<name>.tsx`
- Service: `src/lib/services/<feature>/<feature>.service.ts`
- API helper: `src/lib/api/<feature>.ts` or another focused module name
- Auth helper: `src/lib/auth/<module>.ts`
- Config: `src/config/<module>.ts`
- Store: `src/store/<feature>-store.ts`
- Types: `src/types/<feature>.types.ts`

If route handlers are reintroduced:

- Collection endpoint: `src/app/api/<resource>/route.ts`
- Item endpoint: `src/app/api/<resource>/[id]/route.ts`

## Server and Client Boundary

- Use Server Components by default for pages and layouts.
- Add `"use client"` only when required for interactivity, browser APIs, or client-only state.
- Avoid mounting global providers if a local client component solves the problem.

## Auth Boundary

- `NEXT_PUBLIC_BACKEND_API_URL` is the frontend integration setting.
- The Go Fiber backend owns refresh-token issuance, rotation, revocation, and the HttpOnly cookie.
- The frontend owns only the in-memory access token and current user session in `src/store/auth-store.ts`.
- `SessionProvider` bootstraps the session with `POST /api/v1/auth/refresh`.
- `authClient` is the credentialed client for auth endpoints; `apiClient` is the Bearer-token client for protected API calls.
- `middleware.ts` is currently a pass-through scaffold. The active profile redirect is handled by the client page after session bootstrap.

## API Boundary

- There are currently no active route handlers in `src/app/api`.
- If you add one, document it immediately in `docs/API.md`.
- Keep route handlers thin and move reusable logic into services or dedicated helper modules.

## Testing Boundary

- No frontend test script or active auth integration test suite is configured in the current repository. Add focused tests when new API helpers or auth behavior are introduced.
- Test coverage is still minimal and should expand when real API routes or service logic are added.

## Architecture Change Checklist

- Layer boundaries remain intact.
- Import direction still follows dependency flow.
- Active baseline modules are reflected accurately in docs.
- Related docs are synchronized: `README.md`, `docs/API.md`, `docs/PATTERNS.md`, `docs/RULES.md`, and `docs/DATABASE.md` when relevant.

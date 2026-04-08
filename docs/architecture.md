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
- Jest for testing

## Current Runtime Snapshot

Active today:

- `src/app/layout.tsx`
- `src/app/error.tsx`
- `src/app/(public)/page.tsx`
- `src/app/(public)/login/page.tsx`
- `src/app/(public)/register/page.tsx`
- `src/app/(protected)/profile/page.tsx`
- `src/config/env.ts`
- `src/config/routes.ts`
- `src/config/navigation.ts`
- `src/config/site.ts`
- `auth.ts`
- `src/lib/auth/*`
- `src/lib/api/*`
- `src/providers/*`
- `src/hooks/*`
- `src/store/auth-store.ts`
- `src/components/ui/button.tsx`
- `src/components/common/header.tsx`
- `src/components/common/footer.tsx`
- `src/components/common/loading.tsx`
- `src/components/common/not-found.tsx`
- `middleware.ts`

There are no active route handlers under `src/app/api` in the current tree.

## Directory Responsibilities

- `src/app/*`
  - Route segments, page and layout composition, metadata, and route-level error boundaries.
- `src/components/common/*`
  - Shared route-level UI such as loading or not-found screens.
- `src/components/ui/*`
  - Reusable UI primitives with no domain knowledge.
- `src/components/features/*`
  - Feature-level UI composition.
- `src/services/*`
  - Intended business logic and use-case orchestration. Still intentionally thin in the current repo.
- `src/lib/api/*`
  - Shared HTTP utilities, query keys, and API error helpers.
- `src/lib/auth/*`
  - Cookie-backed session helpers, permissions, and auth metadata.
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
- Protected page: `src/app/(protected)/<segment>/page.tsx`
- Feature component: `src/components/features/<feature>/...`
- Common route UI: `src/components/common/<name>.tsx`
- UI primitive: `src/components/ui/<name>.tsx`
- Service: `src/services/<feature>/<feature>.service.ts`
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

- `src/config/env.ts` is the active auth configuration entrypoint today.
- `AUTH_STRATEGY` supports `nextauth`, `external`, and `none`.
- The current auth bootstrap uses a serialized cookie session, not a backend adapter.
- `middleware.ts` currently guards `/profile` and redirects signed-in users away from `/login`.
- `auth.ts` re-exports the shared auth helpers for future integration points.
- If a real backend or NextAuth adapter is introduced later, update `README.md`, `docs/api.md`, and this file in the same change.

## API Boundary

- There are currently no active route handlers in `src/app/api`.
- If you add one, document it immediately in `docs/api.md`.
- Keep route handlers thin and move reusable logic into services or dedicated helper modules.

## Testing Boundary

- Jest is configured and currently covers the cookie-session helper flow.
- Test coverage is still minimal and should expand when real API routes or service logic are added.

## Architecture Change Checklist

- Layer boundaries remain intact.
- Import direction still follows dependency flow.
- Active baseline modules are reflected accurately in docs.
- Related docs are synchronized: `README.md`, `docs/api.md`, `docs/patterns.md`, `docs/rules.md`, and `docs/database.md` when relevant.

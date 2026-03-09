# Architecture (Frontend Next.js Boilerplate)

This document defines architecture boundaries that must be preserved.

## Stack Baseline
- Next.js 16 (App Router)
- React 19
- TypeScript strict
- Tailwind CSS v4
- TanStack Query
- React Hook Form
- `@hookform/resolvers`
- Zod
- shadcn/ui-style component system
- Jest for testing

## Directory Responsibilities
- `src/app/*`
  - Route segments, page and layout composition, metadata, not-found.
- `src/app/api/*`
  - HTTP boundary (`GET`, `POST`, etc.), status code and response mapping.
- `src/components/ui/*`
  - Reusable UI primitives with no domain knowledge.
- `src/components/features/*`
  - Feature and use-case level UI composition.
- `src/providers/*`
  - App-level providers (auth, theme, state).
- `src/hooks/*`
  - Reusable React hooks and TanStack Query wrappers for client-side state and fetching.
- `src/lib/api/*`
  - Shared fetch utilities and internal API clients for frontend data access.
- `src/lib/services/*`
  - Business logic and use-case orchestration.
- `src/lib/repositories/*`
  - Data access to DB or external APIs.
- `src/lib/schemas/*`
  - Parsing and validation for request, response, and domain schemas.
- `src/types/*`
  - Shared type contracts.
- `src/config/*`
  - App configuration, env access, constants.

## Dependency Direction
`app/page/api -> features -> hooks -> lib(api/services/repositories/clients) -> schemas/types/utils`

Rules:
- `components/ui` must not import service or repository modules.
- Hooks can depend on `lib/api`, but business rules should stay in services.
- Route handlers should not contain complex domain logic.
- Service layer must not depend on UI component modules.

## Implementation Path Map
Use these default paths so prompts and implementations stay consistent:
- Endpoint HTTP: `src/app/api/<resource>/route.ts`
- Business logic: `src/lib/services/<resource>.service.ts`
- Query/DB access: `src/lib/repositories/<resource>.repository.ts`
- Validation schema: `src/lib/schemas/<resource>.schema.ts`
- Shared types/DTO: `src/types/<resource>.types.ts`
- Internal API caller (frontend fetch): `src/lib/api/<resource>.client.ts`
- External API clients (Stripe/OpenAI/etc): `src/lib/clients/<provider>.client.ts`
- UI data hooks: `src/hooks/queries/use-<resource>-query.ts`
- Feature components: `src/components/features/<resource>/...`
- Env mapping: `src/config/env.ts` + `.env.local` (from `.env.example`)

## Server vs Client Component Boundary
- Use Server Components by default for pages and layouts.
- Add `"use client"` only when required:
  - interactive local state
  - browser APIs
  - complex event handling
- Avoid moving entire trees to client rendering without clear reason.

## Form State and Validation Boundary
- Prefer React Hook Form inside `src/components/features/*` or focused client-only child components.
- Use `@hookform/resolvers` when binding shared schemas to form validation.
- Keep canonical validation rules in `src/lib/schemas/*`; client-side validation is for UX, not trust.
- Route handlers and services must still validate and enforce server-side rules.

## API Request Flow (Target Pattern)
1. `route.ts` parses request and applies auth checks.
2. Validate input via schema or type guard.
3. Delegate use-case logic to service.
4. Service calls repository for data access when needed.
5. Route maps result or errors to HTTP response.

## Auth Boundary (External Backend)
- `AUTH_STRATEGY` controls runtime auth boundary:
  - `nextauth`: use `src/app/api/auth/[...nextauth]/route.ts`
  - `external`: disable NextAuth route behavior and delegate auth to backend
  - `none`: disable auth checks
- Keep `src/app/api/auth/[...nextauth]/route.ts` only as NextAuth adapter entrypoint.
- Purpose of this route:
  - session cookie lifecycle (`signin`, `signout`, `session`, `csrf`)
  - adapter boundary between frontend and auth provider callbacks
- Credential verification can be delegated to external backend via:
  - `src/lib/services/auth.service.ts`
  - `src/lib/repositories/auth.repository.ts`
  - `src/lib/clients/auth.client.ts`
- For Go/Express/Nest backends, this repository should not duplicate backend business logic; only call backend auth endpoints and map responses.

## Error Handling Discipline
- Define domain errors in service or repository layers.
- Map errors to HTTP status codes only at API boundary.
- Keep client-facing error responses safe and consistent.

## Backward Compatibility
- Endpoint and prop changes should be non-breaking by default.
- If breaking changes are unavoidable, document:
  - impact
  - migration steps
  - fallback plan

## Architecture Change Checklist
- Layer boundaries remain intact.
- Import direction still follows dependency flow.
- Related docs are synchronized: `docs/api.md`, `docs/patterns.md`, `docs/rules.md`, `docs/database.md` (when data flow is affected).

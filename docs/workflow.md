# Implementation Workflow (Reference Flow)

This file is a reference flow for implementing features without adding ad-hoc structure.

## End-to-End Layer Flow
Current default:
`page/server component or api route -> service -> repository -> schema/types`

Optional client-fetch path:
`client component -> lib/api HTTP helper or client -> hook(optional) -> feature component`

Server-first read path:
`page/server component -> service -> repository/schema/types`

## Default Path Map
- Endpoint HTTP: `src/app/api/<resource>/route.ts`
- Business logic: `src/lib/services/<resource>.service.ts`
- Query/DB access: `src/lib/repositories/<resource>.repository.ts`
- Validation schema: `src/lib/schemas/<resource>.schema.ts`
- Shared types/DTO: `src/types/<resource>.types.ts`
- Internal API caller (frontend HTTP helper): `src/lib/api/<resource>.client.ts`
- External API client (Stripe/OpenAI/etc): `src/lib/clients/<provider>.client.ts`
- UI data hook: `src/hooks/queries/use-<resource>-query.ts` (optional; not used by active flows today)
- Feature components: `src/components/features/<resource>/...`
- Env mapping: `src/config/env.ts` + `.env.local` (from `.env.example`)

## Practical Steps
1. Define/adjust DTO and schema first.
2. Implement repository (data source contract).
3. Implement service (business rules and orchestration).
4. Implement API route handler (HTTP mapping and status codes).
5. Choose UI data path:
   - server component + direct service call for simple read-only flows
   - frontend API caller + optional query hook for client-side fetching and cache use cases
   - prefer the existing `fetchJson` wrapper first; use `axios` only when the flow needs its client features
6. Build UI feature using reusable child components.
7. Verify and sync docs.

## Verification
- `pnpm lint`
- `pnpm type-check`
- `pnpm test` (if relevant)

## Documentation Sync
- API behavior changed: update `docs/api.md`
- Architecture/path policy changed: update `docs/architecture.md`
- Implementation pattern changed: update `docs/patterns.md`
- Database policy changed: update `docs/database.md`
- Workflow changed: update this file

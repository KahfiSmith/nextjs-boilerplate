# Implementation Workflow (Reference Flow)

This file is the reference flow for implementing features without inventing ad-hoc structure.

## Current Default Flow

For route work:

`page -> feature/common component -> service if needed -> lib/utils or config`

For future API work:

`route handler -> service -> helper module -> response mapping`

For future client state work:

`client component -> provider or store only when justified`

## Default Path Map

- Public page: `src/app/(public)/<segment>/page.tsx`
- Protected page: `src/app/(protected)/<segment>/page.tsx`
- Feature UI: `src/components/features/<feature>/...`
- Common route UI: `src/components/common/<name>.tsx`
- Service: `src/services/<feature>/<feature>.service.ts`
- Shared utility: `src/lib/utils/<name>.ts`
- API helper: `src/lib/api/<name>.ts`
- Auth helper: `src/lib/auth/<name>.ts`
- Config: `src/config/<name>.ts`
- Store: `src/store/<feature>-store.ts`
- Types: `src/types/<feature>.types.ts`
- API route when introduced: `src/app/api/<resource>/route.ts`

## Practical Steps

1. Confirm the target file is active and not just a placeholder.
2. Implement the smallest useful change in the appropriate route or feature module.
3. Extract business logic into `src/services/*` only when the page or component starts owning non-trivial behavior.
4. Introduce helpers in `src/lib/*` only when reuse or boundary clarity justifies them.
5. Update docs as part of the same task whenever visible structure or active runtime behavior changes.
6. Verify using the relevant project commands.

## Verification

- `pnpm lint`
- `pnpm type-check`
- `pnpm test`

Note:

- The current Jest example still targets a removed health route, so treat `pnpm test` as a repository-health signal rather than proof of a working API layer until that mismatch is resolved.

## Documentation Sync

- Visible app surface or setup changed: update `README.md`
- API behavior changed: update `docs/api.md`
- Architecture or path policy changed: update `docs/architecture.md`
- Implementation recipe changed: update `docs/patterns.md`
- Database policy changed: update `docs/database.md`
- Workflow changed: update this file

# Implementation Workflow

## General workflow

1. Create/modify components in `src/components/features/`.
2. Add route segments in `src/app/` (pages, layouts).
3. Wire data via hooks (`src/hooks/auth/`) and API clients (`src/lib/api/`).
4. Synchronize Zod schemas (`src/lib/schemas`) and TypeScript types
   (`src/types`).
5. Run `pnpm lint` and `pnpm type-check` before submission.

## Implementation patterns

### Add a new page or UI feature

1. Add route segment in `src/app/...`.
2. Create or compose feature components in `src/components/features/...`.
3. Reuse primitives from `src/components/ui/...`.
4. Move non-trivial domain logic into hooks.
5. Update types and docs when contracts change.
6. Verify with lint, type-check, and manual flow test.

### Add an API route (App Router)

No `src/app/api/**` routes exist yet. When one is added, follow the layer
separation in AGENTS.md (route handler = HTTP boundary, service = business
rules, repository = data access) and update `docs/api/`.

### Update an existing endpoint

- Avoid breaking the existing payload shape.
- Add optional fields for response evolution when possible.
- Keep the endpoint's existing error style consistent.
- Synchronize: `src/lib/api/endpoints.ts`, types, and `docs/api/`.

### Auth-protected flow

1. Choose the protection boundary (currently client-side page guards).
2. Keep provider and auth configuration synchronized.
3. Do not expose sensitive data in client components.
4. Verify unauthorized and authorized behavior.

## Handoff checklist

- [ ] `pnpm lint` passes
- [ ] `pnpm type-check` passes
- [ ] `pnpm docs:check` passes
- [ ] `pnpm verify:all` passes (build + risk + cross-repo)
- [ ] Manual check of the updated flow (happy path + error path)
- [ ] Docs synchronized (`docs/`), `.env.example` if env changed

## Verification harness

The repo ships a tiered verification harness:

- `pnpm verify:fast` - lint, type-check, docs:check.
- `pnpm verify` - adds the production build.
- `pnpm verify:risk` - classifies change risk by path (low/medium/high).
- `pnpm verify:cross-repo` - validates FE↔BE sync (endpoints, error codes,
  cross-repo doc links) against the sibling `fiber-boilerplate` repo.
- `pnpm verify:all` - everything above.

A pre-commit hook runs `pnpm verify:fast` automatically. CI runs lint,
type-check, docs:check, build, and risk classification on every push/PR.

## Documentation sync rules

The docs are a source of truth for the repository. When code changes, keep the
relevant docs in sync:

| Change | Update |
|---|---|
| Folder structure, architecture, dependency rules | `docs/architecture/*` |
| API endpoints, clients, error format | `docs/api/*` |
| Security model, authn/authz, secrets | `docs/security/*` |
| Coding style, naming, validation, error handling | `docs/conventions/*` |
| Env variables | `.env.example` + `docs/security/secrets.md`, `docs/infrastructure/deployment.md` |
| New feature or behavior | `docs/features/*`, `docs/product/*` |

`pnpm docs:check` validates links, `src/` path references, and API endpoints
against the code, and the pre-commit hook runs it automatically. A handoff is
incomplete if the docs are not synchronized.

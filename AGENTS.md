# Repository Guidelines (Frontend Next.js Boilerplate)

This document defines implementation rules for agents and contributors in this repository.
Goal: consistent, fast, safe delivery without over-engineering.

## Source of Truth (Read First)
- Product and project context: `README.md`
- Non-negotiable rules: `docs/rules.md`
- Coding standards: `docs/coding-standards.md`
- API documentation: `docs/api.md`
- Architecture: `docs/architecture.md`
- Database policy: `docs/database.md`
- Implementation patterns (do not remove): `docs/patterns.md`
- Workflow reference: `docs/workflow.md`

If any conflict appears, follow the current runtime behavior and active routes in `src/app`.

## Documentation Sync Rules (Required)
- If non-negotiable constraints change: update `docs/rules.md`.
- If coding style, naming, or structure changes: update `docs/coding-standards.md`.
- If API endpoints change or are added: update `docs/api.md`.
- If dependency direction or architecture boundaries change: update `docs/architecture.md`.
- If database workflow, schema policy, or persistence flow changes: update `docs/database.md`.
- If reusable implementation recipes change: update `docs/patterns.md`.
- If team implementation flow changes: update `docs/workflow.md`.
- If env usage changes: update `.env.example` and document it in active docs (`docs/architecture.md` and/or `docs/patterns.md`).
- Handoff is incomplete if code changes are done but related docs are not synchronized.

## Tech Stack (Must Know Before Implementation)
- Framework: Next.js `16.x` (App Router)
- UI runtime: React `19.x`
- Language: TypeScript `strict`
- Styling: Tailwind CSS `v4` with CSS variables in `src/app/globals.css`
- UI system: shadcn/ui style (`components.json`, `src/components/ui`)
- Utility libraries: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `framer-motion`
- Linting: ESLint (`eslint.config.mjs`, `next/core-web-vitals`, `next/typescript`)
- Testing: Jest (`pnpm test`)
- Auth and app scaffolding available in `src/lib/repositories`, `src/lib/services`, `src/app/api/auth`

## Non-Negotiables (Hard Rules)
- Use the Next.js App Router structure:
  - UI routes in `src/app/**/page.tsx`, `layout.tsx`
  - API routes in `src/app/api/**/route.ts`
- Keep concerns separated:
  - route handler: HTTP boundary only (parse request, map status code and response)
  - service: business rules and validation
  - repository: data access
  - components: presentation and interaction
- When a widget or component becomes large, split it into smaller reusable components.
- Do not skip layers for complex domain logic.
- Use import alias `@/*` consistently per `tsconfig.json`.
- Preserve existing endpoint contracts unless compatibility impact is clearly stated.
- For placeholder directories, use minimal `index.ts` placeholder modules.
- Never commit secrets or credentials.
- Do not modify global build or lint config unless the task explicitly requires it.

## Engineering Principles (Principal Engineer Mindset)
- Correctness over speed: small correct changes over fast risky patches.
- Maintainability first: code should stay clear for engineers 3-6 months later.
- Stability first: broad refactors only with real need (bugs, maintainability, or performance).
- Explicit trade-off: if choosing a shortcut, clearly document limits and risks.
- Backward compatibility by default: keep old API and prop contracts unless breaking change is approved.
- Observability-aware changes: important behavior must remain verifiable through response, state, logs, or tests.
- Secure by default: validate input and avoid exposing internal raw errors.
- Simplicity is a feature: prefer the simplest design that solves current scope.

## Core Design Principles (DRY, SOLID, KISS)
- DRY:
  - Avoid duplicating logic across feature, service, and repository layers.
  - Extract helpers only when reused and clarity improves.
- SOLID (practical):
  - Single Responsibility: each layer keeps a clear purpose.
  - Open/Closed: extend through focused modules with minimal churn in stable flow.
  - Interface Segregation: keep types and interfaces small and focused.
  - Dependency Inversion: domain and service code should not be tightly coupled to UI or storage details.
- KISS:
  - Avoid unnecessary abstractions for small cases.
  - If uncertain, choose the simpler design that is easier to read and test.

## Architecture Notes (Simple but Strict)

### Layer Responsibilities
- `src/app/*`: route segments, layout, page composition, metadata.
- `src/app/api/*`: HTTP boundary (`GET`, `POST`, etc.), status code and response mapping.
- `src/components/ui/*`: reusable UI primitives.
- `src/components/features/*`: feature-level business UI composition.
- `src/lib/services/*`: domain rules and orchestration.
- `src/lib/repositories/*`: persistence, queries, external integration.
- `src/lib/schemas/*`: schema validation and request-response parsing.
- `src/types/*`: domain and API contracts.

### Dependency Direction
`app/page/api -> components/features -> services -> repositories -> schemas/types/utils`

Note: `components/ui` must not depend on domain logic.

## API Contract Discipline
- When an endpoint changes, synchronize:
  1. `src/app/api/**/route.ts`
  2. related service and repository code
  3. related types and schemas (`src/types`, `src/lib/schemas`)
  4. `docs/api.md`
- For protected endpoints, keep auth checks consistent with the selected boundary.
- Keep response style consistent per endpoint.

## UI and Styling Rules
- Use tokens and CSS variables from `src/app/globals.css`.
- Reuse `src/components/ui` before creating new primitives.
- Feature components should focus on use cases, not primitive styling concerns.
- Break down large UI blocks into reusable child components instead of keeping one oversized component file.
- Keep layouts responsive across desktop and mobile.
- Avoid basic accessibility regressions (labels, semantics, focus states).

## Testing and Verification Rules
Minimum before handoff:
- `pnpm lint`
- `pnpm type-check`
- `pnpm test` (if tests exist and are relevant)
- manual check for updated flow (at least one happy path and one error path for form or API changes)

If full verification cannot run in local environment, clearly state what was not run.

## Implementation Patterns

### Pattern A: Add a New Page or UI Feature
1. Add route segment in `src/app/...`.
2. Create or compose feature components in `src/components/features/...`.
3. Reuse primitives from `src/components/ui/...`.
4. Move non-trivial domain logic into service or helper modules.
5. Update types and docs when contracts change.
6. Verify with lint, type-check, and manual flow test.

### Pattern B: Add a New API Route (App Router)
1. Add `src/app/api/<resource>/route.ts`.
2. Put business logic in `src/lib/services/...`.
3. Put data access in `src/lib/repositories/...`.
4. Add request and response schemas or types.
5. Update `docs/api.md`.
6. Verify status code, payload, and error path.

### Pattern C: Update an Existing Endpoint
- Avoid breaking existing payload shape.
- Add optional fields for response evolution when possible.
- Keep the endpoint's existing error style consistent.

### Pattern D: Auth-Protected Flow
1. Choose the protection boundary (middleware, route handler, or page guard).
2. Keep provider and auth configuration synchronized (`src/components/providers`, `src/config`, `src/lib/auth`).
3. Do not expose sensitive data in client components.
4. Verify unauthorized and authorized behavior.

## Anti Over-Engineering Rules
- Do not add external dependencies without clear technical justification.
- Do not do broad refactors when the request is small and focused.
- Do not split modules unless reuse value is clear.
- Prioritize changes that are small, clear, safe, and testable.

## Git and Safety Rules
- Do not revert unrelated user changes.
- Do not run destructive commands (`git reset --hard`, `git checkout --`) without explicit approval.
- If unexpected file changes appear during work, stop and confirm before proceeding.
- Do not amend commits unless explicitly requested.

## Output Contract (for Agent Handoff)
Always report in this order:
1. Short solution summary
2. Files changed
3. Verification steps
4. Risks or unverified items

## Quick Command Reference
```bash
# local dev
pnpm dev
pnpm build
pnpm start

# quality checks
pnpm lint
pnpm type-check
pnpm test
```

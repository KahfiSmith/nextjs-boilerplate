# Implementation Patterns

This document contains reusable implementation recipes for common changes in this repository.

## Pattern A: Add a New Page (UI Route)
1. Create route segment in `src/app/<segment>/page.tsx`.
2. Place feature-level UI composition in `src/components/features/<feature>/...`.
3. Reuse primitives from `src/components/ui/*`.
4. If UI composition gets large, split into smaller reusable subcomponents.
5. Move non-trivial domain logic into `src/lib/services/*` when needed.
6. Update docs if API or data contracts change.
7. Verify with `pnpm lint`, `pnpm type-check`, and responsive manual test.

## Pattern B: Add a New API Route
1. Create `src/app/api/<resource>/route.ts`.
2. Parse and validate request input.
3. Delegate business logic to `src/lib/services/*`. 
4. Delegate data access to `src/lib/repositories/*`.
5. Return consistent JSON response shape (`data` or `error`).
6. Update `docs/api.md`.
7. Test happy path and at least one error path.

## Pattern C: Update an Existing Endpoint
1. Review the current endpoint contract in `docs/api.md`.
2. Avoid breaking payload changes.
3. Add optional fields first when evolving responses.
4. Keep existing error handling style for that endpoint.
5. Update docs and record compatibility impact.

## Pattern D: Form + API Submission
1. Build the form in a feature component or a focused client-only child component.
2. Use `react-hook-form` for field state, submission flow, and error wiring.
3. Use `@hookform/resolvers` when connecting a shared schema to client-side validation.
4. Keep the canonical schema in `src/lib/schemas/*` and re-validate on the server.
5. Handle loading, success, and error states explicitly.
6. Do not expose raw internal errors in UI.

## Pattern E: Server-First Read Path
1. Start with a Server Component for read-only UI.
2. Call `src/lib/services/*` directly when the data is already owned by this app and no client revalidation is needed.
3. Keep the API route for external consumers or independent HTTP checks if needed.
4. Add a client component only when interactivity, browser APIs, or live client re-fetching is required.

## Pattern F: Optional TanStack Query Data Fetching
1. Put the raw HTTP helper in `src/lib/api/<resource>.client.ts`.
2. Parse the response with a Zod schema from `src/lib/schemas/*`.
3. Wrap the request with a hook in `src/hooks/queries/use-<resource>-query.ts`.
4. Add centralized query keys only when multiple client queries exist; do not assume `src/hooks/queries/query-keys.ts` already exists.
5. Consume the hook from feature components, not from UI primitives.
6. Use the existing `fetchJson` wrapper by default; adopt `axios` only when the feature benefits from instance-level config or interceptors.
7. Skip this pattern for simple server-rendered reads that do not benefit from client caching.

## Pattern G: Auth-Protected Area
1. Choose protection boundary: middleware, route handler, or page-level guard.
2. Keep auth providers and config synchronized in `src/providers` and `src/lib/auth` when a client provider is actually mounted.
3. For sensitive data, prefer server boundary fetching.
4. Test unauthorized, authorized, and expired-session cases.
5. If credentials are managed by external backend (Go/Express/Nest), call backend API from `services -> repositories -> lib/clients` rather than embedding auth logic in route handlers.
6. Select `AUTH_STRATEGY` first (`nextauth`, `external`, `none`) and keep middleware/login behavior aligned with that strategy. In the current repo, middleware protects `/` only.

## Pattern H: Add a UI Primitive
1. Add component in `src/components/ui/*`.
2. Use `cn` helper (`src/lib/utils/cn.ts`) for class merging.
3. Use `cva` variant pattern if component has multiple variants.
4. Keep domain logic out of primitive UI components.

## Pattern I: Add New Config or Env Usage
1. Add key in the relevant config module (`src/config/*`).
2. Validate env availability at startup or runtime as needed.
3. Update env notes in active docs (`docs/architecture.md` and/or `docs/patterns.md`).
4. Add verification notes for missing-env behavior.

## Pattern J: Database or Persistence Change
1. Apply data-layer changes in repository and service boundaries.
2. Keep API behavior synchronized if request/response or side effects change.
3. Update `docs/database.md` with policy/workflow impact.
4. Prefer migration-based approach for shared environments.
5. Verify local DB behavior and rollback plan for risky changes.

## Anti-Patterns (Avoid)
- Direct DB queries in route handlers when service or repository layers are in use.
- UI primitives aware of domain auth or business state.
- New external dependencies for problems solvable with simple internal utilities.
- Large cross-module refactors when user request is a small focused change.

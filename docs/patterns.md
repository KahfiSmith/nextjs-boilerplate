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
1. Build form in feature component.
2. Add basic client-side validation for UX.
3. Re-validate on server side (API and service).
4. Handle loading, success, and error states explicitly.
5. Do not expose raw internal errors in UI.

## Pattern E: Auth-Protected Area
1. Choose protection boundary: middleware, route handler, or page-level guard.
2. Keep auth providers and config synchronized in `src/components/providers` and `src/lib/auth`.
3. For sensitive data, prefer server boundary fetching.
4. Test unauthorized, authorized, and expired-session cases.
5. If credentials are managed by external backend (Go/Express/Nest), call backend API from `services -> repositories -> lib/clients` rather than embedding auth logic in route handlers.
6. Select `AUTH_STRATEGY` first (`nextauth`, `external`, `none`) and keep middleware/login behavior aligned with that strategy.

## Pattern F: Add a UI Primitive
1. Add component in `src/components/ui/*`.
2. Use `cn` helper (`src/lib/utils/cn.ts`) for class merging.
3. Use `cva` variant pattern if component has multiple variants.
4. Keep domain logic out of primitive UI components.

## Pattern G: Add New Config or Env Usage
1. Add key in the relevant config module (`src/config/*`).
2. Validate env availability at startup or runtime as needed.
3. Update env notes in active docs (`docs/architecture.md` and/or `docs/patterns.md`).
4. Add verification notes for missing-env behavior.

## Pattern H: Database or Persistence Change
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

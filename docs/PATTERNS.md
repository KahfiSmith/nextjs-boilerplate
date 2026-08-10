# Implementation Patterns

This document contains reusable implementation recipes for common changes in this repository.

## Pattern A: Add a Public Page

1. Create the route in `src/app/(public)/<segment>/page.tsx`.
2. Put non-trivial UI composition in `src/components/features/<feature>/...`.
3. Reuse primitives from `src/components/ui/*`.
4. If the page needs domain logic, add or extend `src/services/<feature>/<feature>.service.ts`.
5. Update `README.md` if the route becomes part of the visible app surface.
6. Verify with `pnpm lint`, `pnpm type-check`, and a manual responsive check.

## Pattern B: Add a Dashboard/Protected Page

1. Create the route in `src/app/(dashboard)/<segment>/page.tsx`.
2. Confirm whether the existing client-side session guard is enough for the page.
3. Keep auth checks explicit and close to the boundary.
4. Document behavior changes in `README.md` and `docs/ARCHITECTURE.md`.
5. Test both authenticated and unauthenticated behavior.

## Pattern C: Activate a Placeholder Feature Module

1. Confirm the module is currently placeholder-only.
2. Implement only the file or folder needed for the feature.
3. Keep the module scoped to one responsibility.
4. Update docs that previously marked the area as placeholder.
5. Avoid filling multiple empty folders in the same task without a concrete use case.

## Pattern D: Add an API Route

1. Create `src/app/api/<resource>/route.ts`.
2. Keep the handler as the HTTP boundary only.
3. Move reusable logic into `src/services/*` or another focused helper module.
4. Return consistent JSON response shapes.
5. Update `docs/API.md`.
6. Add or update tests for both happy path and at least one error path.

## Pattern E: Add or Update Auth UI

1. Keep route files in `src/app/(auth)` or `src/app/(dashboard)` thin.
2. Put interactive form UI in `src/components/features/auth/*`.
3. Use the shared Axios clients and endpoint constants in `src/lib/api/*`.
4. Keep the access token in the non-persisted auth store; never read the backend refresh cookie in JavaScript.
5. If auth runtime behavior changes, document the active flow in `README.md`, `docs/API.md`, and `docs/ARCHITECTURE.md`.
6. Test login, refresh/bootstrap, logout, redirect, and unauthenticated behavior as applicable.

## Pattern F: Introduce a Client Provider or Store

1. Start with local component state first.
2. Add a provider in `src/providers/*` only when a subtree truly needs shared client context.
3. Add a store in `src/store/*` only when component state is no longer sufficient.
4. Scope the provider or store narrowly and keep auth state non-persisted.
5. Update `docs/ARCHITECTURE.md` when a provider or store becomes part of the active runtime.

## Pattern G: Add a Shared Utility or Config Module

1. Put low-level helpers in `src/lib/utils/*`.
2. Put environment or configuration helpers in `src/config/*`.
3. Keep helpers framework-agnostic when possible.
4. Update `.env.example` and docs when env usage changes.

## Pattern H: Repair or Extend Tests

1. Verify the target runtime file actually exists before writing the test.
2. Prefer testing active routes and active helpers over removed scaffolds.
3. Remove or replace stale example tests when the implementation they cover no longer exists.
4. Keep tests aligned with the current tree, not with planned architecture.

## Anti-Patterns (Avoid)

- Directly copying old planned architecture into docs or code without checking whether the files exist.
- Large cross-module refactors when the request is a focused documentation or structure update.
- Adding providers, stores, or API helpers just to make the tree look complete.

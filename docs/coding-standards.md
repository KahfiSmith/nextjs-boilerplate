# Coding Standards

This file defines coding standards to keep implementation quality consistent.

## Language and Framework

- Use TypeScript strict mode.
- Follow Next.js App Router conventions.
- Use React functional components.
- Prefer Server Components by default for route files.

## Naming Conventions

- React component files: `kebab-case.tsx`.
- Component names: `PascalCase`.
- Functions and variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true immutable constants.
- Feature services should live under feature folders such as `src/services/auth/auth.service.ts`.

## Imports

- Prefer `@/*` alias imports based on `tsconfig.json`.
- Keep import order clear: external libraries, internal aliases, then relative imports.
- Remove unused imports.

## Components

- `src/components/ui/*`: UI primitives only, no domain logic.
- `src/components/common/*`: shared route-level UI such as loading and not-found states.
- `src/components/features/*`: feature and use-case composition.
- Use `"use client"` only when browser interaction, client state, or side effects are required.
- If a component becomes too large, extract reusable child components instead of keeping one monolithic file.

## Routes and Route Groups

- Keep public routes in `src/app/(public)/*`.
- Keep protected routes in `src/app/(protected)/*`.
- Route groups organize access and presentation only; they do not replace service boundaries.
- Do not assume route-group names become part of the URL.

## Services, API Helpers, and Auth Helpers

- Put business rules in `src/services/*`.
- Put reusable frontend API helpers in `src/lib/api/*`.
- Put auth-specific helpers in `src/lib/auth/*`.
- Today, several files in those directories are placeholders; when implementing them, keep them small and feature-owned.
- Do not move business rules into hooks or UI components.

## Providers, Hooks, and Store

- `src/providers/*`: client providers only when a subtree actually needs them.
- `src/hooks/*`: reusable React hooks only.
- `src/store/*`: client-side state only when local component state is no longer enough.
- Avoid mounting global providers just because the folder exists.

## Styling

- Use Tailwind utilities and design tokens from `src/app/globals.css`.
- Reuse existing UI primitives before creating new ones.
- Keep layouts responsive and avoid accessibility regressions.

## API and Error Handling

- If you add API routes, keep handlers thin and move reusable logic out of `route.ts`.
- Do not expose raw internal errors to clients.
- Keep request and response contracts synchronized with `docs/api.md`.

## Validation and Types

- Define shared contracts in `src/types/*`.
- Introduce schema files only when there is real validation logic to share.
- Avoid `any`; if unavoidable, explain why.
- Keep env parsing centralized in `src/config/env.ts` or another explicit config module.

## Quality Gates

Before handoff, run based on scope:

- `pnpm lint`
- `pnpm type-check`
- `pnpm test`

## Anti-Patterns

- Over-abstraction for small use cases.
- Broad refactors outside requested scope.
- Adding external dependencies without strong reason.
- Documenting placeholder modules as if they were already active in production.

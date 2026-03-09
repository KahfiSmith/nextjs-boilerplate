# Coding Standards

This file defines coding standards to keep implementation quality consistent.

## Language and Framework
- Use TypeScript strict mode.
- Follow Next.js App Router conventions.
- Use React functional components.

## Naming Conventions
- React component files: `kebab-case.tsx` (or match existing folder conventions when already established).
- Component names: `PascalCase`.
- Functions and variables: `camelCase`.
- Global constants: `UPPER_SNAKE_CASE` only for true immutable constants.

## Imports
- Prefer `@/*` alias imports based on `tsconfig.json`.
- Keep import order clear: external libraries -> internal aliases -> relative imports.
- Remove unused imports.

## Components
- `src/components/ui/*`: UI primitives only, no domain logic.
- `src/components/features/*`: feature and use-case composition.
- `src/providers/*`: app-level client providers such as auth or theme wrappers.
- Use `"use client"` only when browser interaction or local state is required.
- If a component becomes too large, extract reusable child components instead of keeping one monolithic file.
- Prefer feature components or focused client children for form state management with `react-hook-form`.

## Hooks
- `src/hooks/*`: reusable React hooks only.
- Put TanStack Query hooks in `src/hooks/queries/*`.
- Do not move business rules into hooks; keep domain logic in `src/lib/services/*` and data mapping in repositories or clients.

## Route Organization
- Use route groups such as `src/app/(public)/*`, `src/app/(auth)/*`, and `src/app/(dashboard)/*` when they improve clarity without changing URL structure.
- Keep route groups focused on presentation and access organization; business logic still belongs in services and repositories.

## Styling
- Use Tailwind utilities and design tokens from `src/app/globals.css`.
- Avoid hardcoded global values that bypass tokens.
- Reuse existing UI primitives before creating new ones.

## API and Error Handling
- API route handlers should parse input, enforce auth checks, and map status/response.
- Put business logic in services.
- Put data access in repositories.
- Put frontend fetch helpers in `src/lib/api/*`.
- Do not expose raw internal errors to clients.

## Validation and Types
- Define domain and API contracts in `src/types/*` or `src/lib/schemas/*`.
- Prefer shared schemas with `@hookform/resolvers` when client forms need schema-backed validation.
- Treat client-side validation as UX only; server boundaries remain authoritative.
- Avoid `any`; if unavoidable, explain why.
- Keep request/response contracts synchronized with `docs/api.md`.

## Quality Gates
Before handoff, run (based on scope):
- `pnpm lint`
- `pnpm type-check`
- `pnpm test`

## Anti-Patterns
- Over-abstraction for small use cases.
- Broad refactors outside requested scope.
- Adding external dependencies without strong reason.

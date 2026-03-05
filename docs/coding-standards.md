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
- Use `"use client"` only when browser interaction or local state is required.
- If a component becomes too large, extract reusable child components instead of keeping one monolithic file.

## Styling
- Use Tailwind utilities and design tokens from `src/app/globals.css`.
- Avoid hardcoded global values that bypass tokens.
- Reuse existing UI primitives before creating new ones.

## API and Error Handling
- API route handlers should parse input, enforce auth checks, and map status/response.
- Put business logic in services.
- Put data access in repositories.
- Do not expose raw internal errors to clients.

## Validation and Types
- Define domain and API contracts in `src/types/*` or `src/lib/schemas/*`.
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

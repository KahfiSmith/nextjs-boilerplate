# Coding Standards & Naming

## TypeScript

- Strict mode (`tsconfig.json`): `strict: true`, no `any` where avoidable.
- Lint rules (`eslint.config.mjs`):
  - `@typescript-eslint/no-explicit-any` - warn
  - `@typescript-eslint/no-unused-vars` - warn
  - `prefer-const` - error
  - `no-console` - warn
  - `react-hooks/exhaustive-deps` - warn

## Components

- Next.js Server Components by default; `"use client"` only for interactivity.
- Client components are used where browser APIs, hooks, or state are needed
  (e.g. forms, auth pages, providers).
- `components/ui` primitives are business-free.

## Imports

- Alias `@/*` maps to `./src/*` (`tsconfig.json`).
- Barrel exports via `index.ts` for public module surfaces
  (`src/types`, `src/store`, `src/hooks/auth`, `src/lib/utils`,
  `src/components/ui`, `src/components/common`). `src/config` stays
  path-specific (`@/config/routes`, `@/config/site`).

## Styling

- Tailwind CSS v4 with CSS variables in `src/app/globals.css`.
- Reuse `src/components/ui` before creating new primitives.
- Feature components focus on use cases, not primitive styling.

## Naming

### Files and folders

- **Files**: `kebab-case.tsx` or `kebab-case.ts` (`login-form.tsx`,
  `auth-store.ts`, `use-login.ts`).
- **Folders**: `kebab-case`, feature folders under `components/features/`
  (`auth/`), route groups in `src/app/` (`(auth)`, `(dashboard)`, `(public)`).

### Code

- **React Components**: `PascalCase` (`LoginForm`, `SessionProvider`).
- **Variables / Functions**: `camelCase` (`isPending`, `handleSubmit`).
- **Constants**: `UPPER_SNAKE_CASE` for exportable constant maps
  (`ROUTES`, `API_ENDPOINTS`, `AUTH_ERROR_CODES`, `QUERY_KEYS`).

### Exports

- Named exports preferred over default exports.
- Barrel `index.ts` re-exports the module's public surface.

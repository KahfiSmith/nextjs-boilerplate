# Architecture Overview

Next.js 16 App Router boilerplate connected with Go Fiber backend services.

## Current system

This repository is one Next.js application. It is a frontend-only boilerplate:
the Go Fiber backend owns authentication sessions, refresh cookies, and the
database. The frontend owns rendering, client-side form validation, and an
in-memory auth session.

```text
browser
  -> Next.js App Router (React 19, client components)
     -> feature components (src/components/features)
        -> hooks (src/hooks/auth)
           -> Axios clients (src/lib/api)
              -> Zustand auth store (src/store)
                 -> Go Fiber backend (NEXT_PUBLIC_BACKEND_API_URL)
```

## Core stack

| Concern      | Choice                          | Current use                                        |
| ------------ | ------------------------------- | -------------------------------------------------- |
| Runtime      | Node.js 20+                     | Development and build                              |
| Framework    | Next.js 16 (App Router)         | Route groups and layouts                           |
| UI           | React 19                        | Client components for interactive pages            |
| Language     | TypeScript 5.9 (strict)         | All application code                               |
| Styling      | Tailwind CSS 4, CSS variables   | Tokens in `src/app/globals.css`                    |
| UI primitives| shadcn/ui (`components.json`)   | `src/components/ui` (Button, Input, Label)         |
| State        | Zustand 5                       | `auth-store` (in-memory), `theme-store` (persisted)|
| Server state | TanStack Query 5                | Query config and auth invalidations                |
| HTTP client  | Axios                           | `authClient` / `apiClient` in `src/lib/api`        |
| Validation   | Zod 4, React Hook Form          | `src/lib/schemas/auth.schema.ts`, form resolvers   |
| Package mgr  | pnpm 10.33.0                    | Pinned in `package.json`                           |

## Implemented routes

| Route      | Segment           | Component(s)                              | Guard                        |
| ---------- | ----------------- | ----------------------------------------- | ---------------------------- |
| `/`        | `(public)`        | `HomePage` + `Header`/`Footer`            | none (public)                |
| `/login`   | `(auth)`          | `LoginPage` → `LoginForm`                 | redirects if authenticated   |
| `/register`| `(auth)`          | `RegisterPage` → `RegisterForm`           | none                         |
| `/profile` | `(dashboard)`     | `ProfilePage` + `LogoutButton`            | redirects if unauthenticated |

All interactive pages are client components (`"use client"`). Layouts and
`register/page.tsx` remain server components.

## Backend

The backend is a separate repository (`fiber-boilerplate`, Go Fiber). See its
[architecture overview](../../../../Backend/fiber-boilerplate/docs/architecture/overview.md)
and [folder structure](../../../../Backend/fiber-boilerplate/docs/architecture/folder-structure.md).

## Not implemented

- `src/app/api/**` - no server-side route handlers exist.
- Middleware-enforced access control - `middleware.ts` is a pass-through.
- Database layer - managed by the Go Fiber backend.
- Server-only modules, services, or repositories.

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

## Folder structure

```
src/
├── app/                  # App Router routes and layouts
│   ├── (auth)/           # Login and register pages
│   ├── (dashboard)/      # Protected pages (profile)
│   ├── (public)/         # Public landing page
│   ├── layout.tsx        # Root layout (fonts, metadata, AppProvider)
│   └── globals.css       # Tailwind v4 tokens and CSS variables
├── components/
│   ├── common/           # Shared layout/utility components (Header, Footer, Error, Loading, NotFound)
│   ├── features/         # Feature-owned UI components (auth/login-form, register-form, logout-button)
│   └── ui/               # Primitive shadcn/ui components (Button, Input, Label)
├── config/               # App static constants (site, ROUTES)
├── hooks/                # Custom React hooks (auth: use-login, use-logout, use-register)
├── lib/
│   ├── api/              # Axios clients, endpoints, query config, error handling
│   ├── schemas/          # Zod validation schemas (auth.schema)
│   └── utils/            # Utility helpers (cn, format-date, format-currency)
├── providers/            # React context providers (App, Query, Session)
├── store/                # Zustand global state stores (auth-store, theme-store)
└── types/                # TypeScript domain contracts (auth.types, common.types)
```

### Ownership

| Path                    | Responsibility                                                   | Example files                                  |
| ----------------------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| `src/app/`              | Route composition, layouts, metadata, client-side guards         | `(auth)/login/page.tsx`, `(dashboard)/layout.tsx` |
| `src/components/common/`| Cross-page layout and shell components                           | `header.tsx`, `footer.tsx`, `error.tsx`        |
| `src/components/features/` | Feature-owned UI, one folder per feature (e.g. `auth/`)       | `auth/login-form.tsx`, `auth/logout-button.tsx`|
| `src/components/ui/`    | Business-free primitives (shadcn/ui)                             | `button.tsx`, `input.tsx`, `label.tsx`         |
| `src/config/`           | Static constants and route definitions                           | `site.ts`, `routes.ts`                         |
| `src/hooks/`            | Custom hooks that wrap API calls and mutations                   | `auth/use-login.ts`, `auth/use-logout.ts`      |
| `src/lib/api/`          | HTTP boundary: Axios clients, endpoints, query config            | `client.ts`, `endpoints.ts`, `queries.ts`      |
| `src/lib/schemas/`      | Zod validation schemas                                           | `auth.schema.ts`                               |
| `src/lib/utils/`        | Pure utility helpers                                             | `cn.ts`, `format-date.ts`, `format-currency.ts`|
| `src/providers/`        | Client-side providers mounted once in the root layout            | `app-provider.tsx`, `session-provider.tsx`     |
| `src/store/`            | Zustand global state                                             | `auth-store.ts`, `theme-store.ts`              |
| `src/types/`            | Domain and API contracts                                         | `api.types.ts`, `auth.types.ts`, `common.types.ts` |

### Dependency rules

#### Dependency flow

`app -> components/features -> hooks -> lib/api -> store -> types`
`providers -> lib/api | store` (session bootstrap and query client setup)

#### Rules

- Components in `components/ui` must stay pure with zero domain logic.
- Pages delegate business logic to feature components and hooks; pages hold
  only lightweight client-side guards (redirects based on `useAuthStore` status).
- Direct external backend access happens only through `src/lib/api`.
- Feature components use hooks (e.g. `useLogin`, `useLogout`) rather than
  calling API clients directly.
- Barrel `index.ts` files expose a small public API per directory
  (`src/types`, `src/store`, `src/hooks/auth`, `src/lib/utils`,
  `src/components/ui`, `src/components/common`). `src/config` is imported
  path-specifically (`@/config/routes`, `@/config/site`).
- `process.env` is read only by approved files (Axios client base URL).
- No server-only modules exist; there is no server layer to import from.

## Data flow

### Request flow

```text
User action
  -> component handler (form submit)
     -> hook mutation (useLogin / useRegister / useLogout)
        -> Axios client (authClient or apiClient)
           -> Go Fiber backend (POST /api/v1/auth/...)
              -> response envelope (ApiResponse<T>)
                 -> interceptor unwraps to response.data.data (apiClient only)
                    -> Zustand store update (auth-store)
                       -> UI re-render + redirect
```

### Notes

1. User actions trigger component state / handlers.
2. Forms validate inputs via `src/lib/schemas` (Zod + `@hookform/resolvers/zod`)
   before any API transport.
3. Client API requests execute through `authClient` or `apiClient`
   (`src/lib/api`):
   - `authClient` (withCredentials) for authentication endpoints.
   - `apiClient` for business endpoints with Bearer token and single-flight
     refresh on `401 ACCESS_TOKEN_EXPIRED`.
4. `apiClient` unwraps the backend envelope on success and returns
   `response.data.data`.
5. Auth sessions maintain in-memory state in `useAuthStore` (Zustand).
6. Refresh token flow runs transparently via HttpOnly cookies and single-flight
   execution.

### Rendering

- The root layout mounts `AppProvider` → `QueryProvider` → `SessionProvider`.
- On mount, `SessionProvider` calls `POST /api/v1/auth/refresh` to restore the
  in-memory session.
- Pages read `useAuthStore` status and redirect accordingly (client-side
  guards).

## Backend

The backend is a separate repository (`fiber-boilerplate`, Go Fiber). See its
[architecture overview](../../../../Backend/fiber-boilerplate/docs/architecture/overview.md)
and [folder structure](../../../../Backend/fiber-boilerplate/docs/architecture/folder-structure.md).

## Architecture Decision Records (ADRs)

Key architectural choices and technical designs are recorded in [ADRs](adr/README.md):

- [ADR-001: In-Memory Auth Session with HttpOnly Refresh Cookie](adr/ADR-001-in-memory-auth-session.md)
- [ADR-002: Single-Flight Token Refresh in the Axios Interceptor](adr/ADR-002-single-flight-refresh.md)
- [ADR-003: Client-Side Route Guards over Middleware](adr/ADR-003-client-side-route-guards.md)

## Not implemented

- `src/app/api/**` - no server-side route handlers exist.
- Middleware-enforced access control - `middleware.ts` is a pass-through.
- Database layer - managed by the Go Fiber backend.
- Server-only modules, services, or repositories.

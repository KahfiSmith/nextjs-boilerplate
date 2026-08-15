# Folder Structure & Dependency Rules

## Directory tree

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

## Ownership

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

## Dependency rules

### Dependency flow

`app -> components/features -> hooks -> lib/api -> store -> types`
`providers -> lib/api | store` (session bootstrap and query client setup)

### Rules

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

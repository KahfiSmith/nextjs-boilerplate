# Nextjs Boilerplate

Next.js (App Router) boilerplate with TypeScript, Tailwind CSS, and a clean modular structure.

## Requirements

- Node.js 20+
- pnpm 9+

## Tech Stack

- Frontend framework: Next.js 16 (App Router)
- UI library: React 19
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4
- UI primitives: shadcn/ui-style setup
- Authentication: strategy-based (`nextauth` | `external` | `none`)
- Linting: ESLint (`next/core-web-vitals`, `next/typescript`)
- Testing: Jest
- Database scaffold: Prisma-style command workflow (`db:push`, `db:studio`, `db:seed`)

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000` to view the app.

For Windows PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

## Scripts

```bash
pnpm dev         # run dev server
pnpm build       # production build
pnpm start       # run production build
pnpm lint        # linting
pnpm type-check  # TypeScript type check
pnpm test        # run tests
pnpm test:watch  # watch test mode
pnpm db:push     # prisma db push
pnpm db:studio   # prisma studio
pnpm db:seed     # seed database
```

## Quality Checks

```bash
pnpm lint
pnpm type-check
pnpm test
```

## Database (Fullstack Readiness)

- Yes, database documentation is recommended for this repository because it may be used as fullstack.
- Use `pnpm db:push` for local prototyping only.
- For shared/staging/production environments, prefer migration-based workflow (versioned migrations + rollback plan).
- See [docs/database.md](docs/database.md) for the full policy.

## Folder Structure

```text
.
├─ docs/
│  ├─ api.md
│  ├─ architecture.md
│  ├─ coding-standards.md
│  ├─ database.md
│  ├─ patterns.md
│  ├─ rules.md
│  └─ workflow.md
├─ public/
│  ├─ fonts/
│  ├─ icons/
│  ├─ images/
│  ├─ next.svg
│  └─ vercel.svg
├─ src/
│  ├─ __tests__/
│  │  └─ index.ts
│  ├─ app/
│  │  ├─ api/
│  │  │  └─ auth/
│  │  │     └─ [...nextauth]/
│  │  │        └─ route.ts
│  │  ├─ auth/
│  │  │  ├─ login/
│  │  │  │  └─ page.tsx
│  │  │  └─ register/
│  │  │     └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ not-found.tsx
│  │  └─ page.tsx
│  ├─ auth.ts
│  ├─ components/
│  │  ├─ common/
│  │  │  └─ index.ts
│  │  ├─ features/
│  │  │  ├─ auth/
│  │  │  │  ├─ login-form.tsx
│  │  │  │  └─ sign-out-button.tsx
│  │  │  └─ index.ts
│  │  ├─ providers/
│  │  │  ├─ auth-provider.tsx
│  │  │  └─ index.ts
│  │  └─ ui/
│  ├─ config/
│  │  ├─ env.ts
│  │  └─ index.ts
│  ├─ hooks/
│  │  └─ index.ts
│  ├─ lib/
│  │  ├─ api/
│  │  │  └─ index.ts
│  │  ├─ auth/
│  │  │  ├─ config.ts
│  │  │  ├─ session.ts
│  │  │  └─ index.ts
│  │  ├─ clients/
│  │  │  └─ index.ts
│  │  ├─ db/
│  │  │  └─ index.ts
│  │  ├─ helpers/
│  │  │  └─ index.ts
│  │  ├─ repositories/
│  │  │  ├─ auth.repository.ts
│  │  │  └─ index.ts
│  │  ├─ schemas/
│  │  │  └─ index.ts
│  │  ├─ services/
│  │  │  ├─ auth.service.ts
│  │  │  └─ index.ts
│  │  └─ utils/
│  └─ types/
│     ├─ auth.types.ts
│     ├─ next-auth.d.ts
│     └─ index.ts
├─ components.json
├─ eslint.config.mjs
├─ middleware.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ CONTRIBUTING.md
└─ tsconfig.json
```

## Notes

- Empty scaffold directories are intentionally tracked using `index.ts`.
- Auth strategy is configured through `.env.local` (`AUTH_STRATEGY=nextauth|external|none`).
- When `AUTH_STRATEGY=nextauth`, auth route uses `src/app/api/auth/[...nextauth]/route.ts`.
- In `nextauth` strategy, credentials source is configurable (`AUTH_MODE=external|demo`).
- External backend auth endpoint is configured by `BACKEND_API_URL` and `BACKEND_AUTH_LOGIN_PATH`.
- If you do not use NextAuth, you can remove `next-auth` dependency together with:
  - `src/app/api/auth/[...nextauth]/route.ts`
  - `src/lib/auth/*`
  - `src/types/next-auth.d.ts`
  - `src/components/providers/auth-provider.tsx`
  - auth UI imports that call `next-auth/react`
- `db:*` scripts are scaffold commands and require Prisma/TSX setup before use.
- Documentation index:
  - API: `docs/api.md`
  - Architecture: `docs/architecture.md`
  - Rules: `docs/rules.md`
  - Coding standards: `docs/coding-standards.md`
  - Database: `docs/database.md`
  - Patterns: `docs/patterns.md`
  - Workflow reference: `docs/workflow.md`
- UI primitives live in `src/components/ui`, while domain components live in `src/components/features`.
- Team workflow and PR expectations are in `CONTRIBUTING.md`.

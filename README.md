# Nextjs Boilerplate

Next.js (App Router) boilerplate with TypeScript, Tailwind CSS, and a clean modular structure.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` to view the app.

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

## Folder Structure

```text
.
├─ docs/
│  └─ API.md
├─ public/
│  ├─ fonts/
│  ├─ icons/
│  ├─ images/
│  ├─ next.svg
│  └─ vercel.svg
├─ src/
│  ├─ __tests__/
│  │  └─ setup.ts
│  ├─ app/
│  │  ├─ api/
│  │  ├─ auth/
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ not-found.tsx
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ common/
│  │  ├─ features/
│  │  ├─ providers/
│  │  └─ ui/
│  ├─ config/
│  │  ├─ auth.ts
│  │  ├─ constants.ts
│  │  ├─ database.ts
│  │  └─ env.ts
│  ├─ hooks/
│  │  └─ index.ts
│  ├─ lib/
│  │  ├─ auth/
│  │  ├─ db/
│  │  │  └─ schema.ts
│  │  ├─ helpers/
│  │  ├─ repositories/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  └─ utils/
│  └─ types/
│     └─ api.types.ts
├─ components.json
├─ eslint.config.mjs
├─ middleware.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
└─ tsconfig.json
```

## Notes

- API docs are available at `docs/API.md`.
- UI primitives live in `src/components/ui`, while domain components live in `src/components/features`.

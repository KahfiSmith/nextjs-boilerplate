# Validation Conventions

## Current schemas

`src/lib/schemas/auth.schema.ts` defines:

- `loginSchema` - `email` (required, valid format), `password` (required, min 8
  chars), optional `redirectTo`.
- `registerSchema` - `name` (required, min 2 chars), `email`, `password`
  (required, min 8 chars).

## Wiring

- Zod schemas are resolved into forms via `@hookform/resolvers/zod`.
- `useForm<LoginInput>({ resolver: zodResolver(loginSchema) })` in
  `LoginForm` and `RegisterForm`.

## Boundaries

- Frontend validation happens at the form boundary, before any API transport.
- No server-side validation exists in this repo (no `src/app/api/**`).
- Backend still validates independently; client validation is UX, not a
  security boundary.

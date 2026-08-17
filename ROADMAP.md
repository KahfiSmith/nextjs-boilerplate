# Roadmap

- Status: Working draft (planning artifact — not implemented behavior)
- Date: 2026-08-17
- Purpose: single place listing what exists and what is planned, so feature
  work has a build order. Implemented features are documented in `docs/features/`;
  this file tracks intent.

## Conventions

- Status legend: **done** = implemented; **in-progress** = actively being built;
  **planned** = to build; **candidate** = considered, not committed.
- When a feature ships, mark it **done** and make sure it has a
  `docs/features/<feature>.md` (the `docs:check` gate requires it).

## Done

- [x] Authentication & user session (login, register, logout, refresh,
      session bootstrap, protected profile, delete account) — see
      `docs/features/authentication.md`
- [x] Landing page (`/`)
- [x] Protected profile surface (`/profile`)

## In progress

(none)

## Planned

1. Forgot-password flow (UI) — endpoint exists on the backend
   (`POST /api/v1/auth/forgot-password`); needs a page + wiring.
2. Reset-password flow (UI) — endpoint exists; needs a page + wiring.
3. Email verification flow (UI) — `verify-email` / `resend-verification`
   endpoints exist; needs pages + wiring.
4. `GET /me` usage — endpoint exists; currently the profile uses the session
   bootstrap payload; wire a dedicated fetch + TanStack Query.
5. Change password — no backend endpoint yet; requires backend work first.

## Candidate (not committed)

- Dashboard / analytics beyond the profile proof.
- Additional route groups beyond `(auth)`, `(dashboard)`, `(public)`.
- Theme persistence refinements.

## Open questions

- Product vision is not finalized (see `docs/product/overview.md`).
- Whether the landing page should evolve into a real marketing surface.

## Follow-ups

- After each planned item ships: update this file's status, add the feature
  doc from `docs/features/_TEMPLATE.md`, and run `pnpm verify:all`.

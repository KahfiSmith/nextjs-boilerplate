# Repository Rules (Hard Rules)

This file defines mandatory rules for implementation. `patterns.md` remains the implementation recipe guide, while this file contains strict requirements.

## Core Rules

- Use the Next.js App Router structure:
  - UI routes in `src/app/**/page.tsx` and `layout.tsx`
  - API routes only in `src/app/api/**/route.ts` when the repo actually has active route handlers
- Keep route groups explicit:
  - public pages under `src/app/(public)/*`
  - auth pages under `src/app/(auth)/*`
  - dashboard/protected pages under `src/app/(dashboard)/*`
- Do not place business logic directly in route files or UI primitives.
- Put domain logic in `src/services/*` when a feature grows beyond simple rendering.
- Never commit secrets or credentials.
- Do not modify global lint or build config unless the task requires it.

## Current Structure Rules

- Treat existing empty files as placeholders, not as proof that a layer is already implemented.
- Do not document placeholder modules as active runtime dependencies.
- If you activate a placeholder area such as `src/providers/*`, `src/lib/api/*`, `src/lib/auth/*`, or `src/store/*`, update the related docs in the same task.
- If you add the first real route handler, `docs/API.md` must document it in that same change.

## API Response Rules

- Backend responses use the envelope `{ success, message, data }` for success and `{ success, code, message, error }` for errors.
- Preserve the backend status and error code when mapping API failures.
- Keep status codes consistent:
  - `400` invalid input
  - `401` unauthorized
  - `403` forbidden
  - `404` not found
  - `409` conflict
  - `500` internal error

## Documentation Sync Rules

- API endpoint changes: update `docs/API.md`.
- Architecture or dependency-direction changes: update `docs/ARCHITECTURE.md`.
- Implementation pattern changes: update `docs/PATTERNS.md`.
- Team implementation flow changes: update `docs/WORKFLOW.md`.
- Rule or delivery process changes: update `docs/RULES.md`.
- Coding style or structure changes: update `docs/CODING-STANDARDS.md`.
- Database workflow or schema policy changes: update `docs/DATABASE.md`.
- Environment variable changes: update `.env.example` and the relevant docs.
- README changes are required when visible route structure or setup instructions change.

## Empty Directory Policy

- Create folders when the feature is implemented instead of preserving broad placeholder scaffolding without ownership.
- Minimal placeholder files are acceptable only when they clearly mark planned structure.
- Do not copy placeholder-only patterns into new features without immediately implementing them.

## Safety Rules

- Do not revert unrelated user changes.
- Do not run destructive commands such as `git reset --hard` or `git checkout --` without explicit approval.
- If unexpected changes appear while working, stop and confirm before touching the same files.

## Handoff Rules

Final output order is mandatory:
1. Short solution summary
2. Files changed
3. Verification steps
4. Risks or unverified items

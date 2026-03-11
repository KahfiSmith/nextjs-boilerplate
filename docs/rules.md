# Repository Rules (Hard Rules)

This file defines mandatory rules for implementation.
`patterns.md` remains the implementation recipe guide, while this file contains strict requirements.

## Core Rules
- Use the Next.js App Router structure:
  - UI routes in `src/app/**/page.tsx`, `layout.tsx`
  - API routes in `src/app/api/**/route.ts`
- Do not skip layers:
  - route handler = HTTP boundary
  - service = business rules
  - repository = data access
- If a widget/component grows large, split it into smaller reusable components.
- Do not change existing endpoint contracts without explicitly stating backward-compatibility impact.
- Never commit secrets or credentials.
- Do not modify global lint or build config unless requested by the task.

## API Response Rules
- Success responses must use a consistent shape per endpoint (`{ data: ... }` or `{ message: "..." }`).
- Error response format: `{ error: "..." }`.
- Keep status codes consistent:
  - `400` invalid input
  - `401` unauthorized
  - `403` forbidden
  - `404` not found
  - `409` conflict
  - `500` internal error

## Documentation Sync Rules
- API endpoint changes: update `docs/api.md`.
- Architecture or dependency-direction changes: update `docs/architecture.md`.
- Implementation pattern changes: update `docs/patterns.md`.
- Team implementation flow changes: update `docs/workflow.md`.
- Rule or delivery process changes: update `docs/rules.md`.
- Coding style or structure changes: update `docs/coding-standards.md`.
- Database workflow/schema policy changes: update `docs/database.md`.
- Env variable changes: update `.env.example`.

## Empty Directory Policy
- Create folders when the feature is implemented instead of preserving broad placeholder scaffolding.
- Minimal `index.ts` placeholder modules are allowed only for intentionally reserved top-level directories such as `src/hooks` or `src/providers`.
- Do not keep arbitrary empty `.ts` or `.tsx` files only to force directory tracking.

## Safety Rules
- Do not revert unrelated user changes.
- Do not run destructive commands (`git reset --hard`, `git checkout --`) without explicit approval.
- If unexpected changes appear while working, stop and confirm.

## Handoff Rules
Final output order is mandatory:
1. Short solution summary
2. Files changed
3. Verification steps
4. Risks or unverified items

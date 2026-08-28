# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Self-audit framework** under `docs/auditing/`:
  - `SELF_AUDIT.md` — 95-item checklist grouped by area (docs sync, features, security, code quality, performance, testing, ops).
  - `agent-instructions.md` — step-by-step instructions for an AI agent running a deep audit.
  - `checklist-template.md` — mandatory report template.
  - `automated-checks.md` — inventory of automated checks and how to extend.
  - `overview.md` — index of the auditing framework.
- New scripts in `scripts/harness/`:
  - `check-self-audit.mjs` — `pnpm verify:audit`: 25+ machine-checkable items (naming, TS hygiene, env consistency, architecture rules, security patterns, dead code).
  - `audit-report.mjs` — `pnpm audit:report`: aggregates `docs:check` + `verify:risk` + `verify:cross-repo` + `verify:audit` into `.audit/report-YYYY-MM-DD.{json,md}`.
- New `package.json` scripts: `verify:audit`, `audit:report`.
- `verify:all` now includes `verify:audit` as a blocking step.
- Pre-commit hook (`.githooks/pre-commit`) now runs `verify:audit` in addition to `docs:check`.
- GitHub Actions CI now has a `Self-audit` step that runs `pnpm verify:audit`.

### Changed
- Restructured documentation hierarchy into nested domain directories under `docs/`.
- Aligned documentation with the current repository structure (auth endpoints, dependency rules, folder tree, API envelope, middleware behavior).
- Deepened documentation to match the reference style: tables, ownership maps, data-flow diagrams, and explicit implemented-vs-planned framing.
- Consolidated overlapping documentation files to reduce count and length (36 files down to 22).
- Added `pnpm docs:check` validation script and pre-commit hook to keep docs in sync with the repo.
- **`User.role`** is now a strict `"user" | "admin"` union (`UserRole`) instead of `string`, matching the backend's role values.
- **Register flow is now auto-login**: `useRegister` reads the same `BackendAuthPayload` envelope as `useLogin`, sets the auth session, and redirects to `/profile` (no more separate login round-trip). Matches the updated BE `/api/v1/auth/register` response.
- **Open-redirect hardening**: `loginSchema.redirectTo` now validates that the value is a same-origin path (`/^\/(?!\/)/`), preventing external redirects.
- **Axios interceptor hardening**: `originalRequest._retry` flag is now typed via `RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }`; the `BACKEND_API_URL` constant is no longer re-read in 3 separate places.
- Removed dead code from the auth store: `setAccessToken` and `getAuthSessionSnapshot` were unused; `setAuthSession`/`clearAuthSession` remain as the canonical action helpers.
- `authClient` is now used for `/auth/register` (cookie-based) instead of `apiClient`, so the refresh cookie is set on register just like on login.

### Removed
- Unused `framer-motion` dependency (and its entry in `AGENTS.md` tech stack).

### Added
- Delete account flow on the profile page (`useDeleteAccount` + `DeleteAccountButton`, wired to `DELETE /api/v1/auth/account`).
- Verification harness: `verify:fast`/`verify`/`verify:all` scripts, risk classification (`verify:risk`), and cross-repo sync check (`verify:cross-repo`).
- GitHub Actions CI (`.github/workflows/ci.yml`): lint, type-check, docs, build, risk classification.
- Feature documentation gate: new route groups must be documented in `docs/features/<feature>.md` (template enforced by `docs:check`).
- Architecture decision records: ADR-001 (in-memory auth session), ADR-002 (single-flight refresh), ADR-003 (client-side route guards).
- Added `ROADMAP.md` and upgraded `docs/product/overview.md` with a product vision section.
- Google SSO (OIDC): "Continue with Google" button on the login form; backend handles the OAuth flow.
- Moved Google OAuth URL out of the component: `googleAuthUrl()` in `src/lib/api/client.ts` + `API_ENDPOINTS.AUTH.GOOGLE`; UI no longer hardcodes the backend URL.

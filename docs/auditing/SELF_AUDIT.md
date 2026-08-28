# Self-Audit Checklist

> **Purpose:** This document is the **source of truth** for "is this repo
> healthy?". Every item has a status field. Re-run on every major refactor,
> release, or quarterly.
>
> **How to use:**
> 1. Run `pnpm verify:all` for automated items (marked `✅`)
> 2. Manually verify items marked `➖`
> 3. Fill the report section at the bottom
> 4. See [agent-instructions.md](agent-instructions.md) for the full workflow
>
> **Status legend:** ✅ pass | ⚠ drift | ❌ broken | ➖ N/A | ⏳ in progress | ⚪ cannot verify
>
> **Automation legend:** ✅ covered by `pnpm verify:audit` or sibling scripts | ➖ manual only

---

## A. Documentation Synchronization (8 items)

| # | Check | How to verify | Automation |
|---|---|---|---|
| A1 | All `.md` links inside `docs/` resolve to existing files | `pnpm docs:check` | ✅ |
| A2 | All `src/...` paths referenced in docs exist | `pnpm docs:check` | ✅ |
| A3 | All `/api/v1/...` endpoints in `docs/api/authentication.md` match `src/lib/api/endpoints.ts` | `pnpm docs:check` | ✅ |
| A4 | Every route group under `src/app/(*)/` has `docs/features/<group>.md` | `pnpm docs:check` | ✅ |
| A5 | `CHANGELOG.md` reflects all changes since last release | manual diff against `git log` | ➖ |
| A6 | `AGENTS.md` engineering rules match current `package.json` scripts and patterns | manual review | ➖ |
| A7 | `README.md` quick-start commands actually work | manual run | ➖ |
| A8 | Cross-repo doc links (to sibling backend) resolve | `pnpm verify:cross-repo` | ✅ |

## B. Feature Completeness (10 items)

Each item: ✅ implemented & synced | ⚠ implemented but different | 🟡 partial | ❌ missing | 🔵 implemented but undocumented

| # | Feature | FE entry point | BE counterpart | Status |
|---|---|---|---|---|
| B1 | Login (email + password) | `useLogin` + `LoginForm` | `POST /auth/login` | ☐ |
| B2 | Register (auto-login) | `useRegister` + `RegisterForm` | `POST /auth/register` (returns `AuthResponse`) | ☐ |
| B3 | Logout (idempotent) | `useLogout` + `LogoutButton` | `POST /auth/logout` | ☐ |
| B4 | Refresh token rotation (single-flight) | `SessionProvider` + interceptor | `POST /auth/refresh` (Lua atomic) | ☐ |
| B5 | Session bootstrap on mount | `SessionProvider` | `POST /auth/refresh` | ☐ |
| B6 | Delete account (password confirm) | `useDeleteAccount` + button | `DELETE /auth/account` | ☐ |
| B7 | Google OAuth (browser-navigated) | `googleAuthUrl()` + button | `GET /auth/google` + callback | ☐ |
| B8 | Protected route guard | `profile/page.tsx` client guard | (no server-side, by design) | ☐ |
| B9 | Login guard (auth user → redirect) | `login/page.tsx` client guard | (no server-side, by design) | ☐ |
| B10 | Forgot/reset/verify/resend/me UI | endpoint constants only | endpoints exist | ☐ |

## C. Functional Correctness (8 items)

| # | Check | How to verify | Automation |
|---|---|---|---|
| C1 | Access token in-memory only (not in localStorage) | grep for `localStorage.setItem.*accessToken` in `src/` | ✅ (audit) |
| C2 | Refresh token never exposed to JS (HttpOnly cookie only) | grep for `document.cookie` in `src/` | ✅ (audit) |
| C3 | Single-flight refresh (no parallel `POST /auth/refresh` calls) | trace `refreshAccessToken` in `src/lib/api/client.ts` | ➖ |
| C4 | On 401 `ACCESS_TOKEN_EXPIRED`, exactly one retry after refresh | trace interceptor in `src/lib/api/client.ts` | ➖ |
| C5 | On terminal auth error (`REFRESH_TOKEN_*` / `SESSION_REVOKED`), force logout | trace `handleQueryError` in `src/lib/api/queries.ts` | ➖ |
| C6 | Cookie `withCredentials: true` on `authClient` only, not `apiClient` | inspect both clients in `src/lib/api/client.ts` | ➖ |
| C7 | Refresh cookie path matches backend (`/api/v1/auth`) | inspect `authClient` baseURL vs cookie path | ➖ |
| C8 | Google OAuth uses `window.location` to `/api/v1/auth/google` (not axios) | trace `googleAuthUrl()` usage | ➖ |

## D. Business Logic (10 items)

| # | Check | How to verify | Automation |
|---|---|---|---|
| D1 | Login redirects to `redirectTo` or `/profile` | trace `useLogin.onSuccess` | ➖ |
| D2 | Register redirects to `/profile` after auto-login | trace `useRegister.onSuccess` | ➖ |
| D3 | Logout clears session and redirects to `/` | trace `useLogout` | ➖ |
| D4 | Delete account redirects to `/` after success | trace `useDeleteAccount` | ➖ |
| D5 | Logout button is disabled during pending request | trace `useLogout.isPending` | ➖ |
| D6 | Form submit buttons are disabled while `isPending` | grep `disabled={isPending}` in feature components | ➖ |
| D7 | Toast displays success message within 1s of API success | trace `toast.promise` usage | ➖ |
| D8 | Toast displays error message from API `message` field | trace `toast.promise` error callback | ➖ |
| D9 | Open-redirect prevention on `redirectTo` (no `//evil.com`) | inspect `loginSchema` regex | ➖ |
| D10 | `LoginInput`, `RegisterInput` are inferred from Zod (no duplicate manual type) | grep `interface LoginInput` in `src/types/` | ✅ (audit) |

## E. Validation & Error Handling (10 items)

| # | Check | How to verify | Automation |
|---|---|---|---|
| E1 | Zod email format matches backend `validate:"email"` | inspect `loginSchema`/`registerSchema` | ➖ |
| E2 | Zod password min length matches backend `validate:"min=8"` | inspect both sides | ➖ |
| E3 | Zod name min length matches backend `validate:"min=2"` | inspect both sides | ➖ |
| E4 | FE `auth-error-codes.ts` includes all BE-produced auth codes | `pnpm verify:cross-repo` | ✅ |
| E5 | FE handles `INVALID_CREDENTIALS` generically (no email enumeration leak) | trace error toast | ➖ |
| E6 | Validation errors from BE surface inline (not just toast) | trace `formState.errors` in forms | ➖ |
| E7 | Network error (no response) shows "connection failed" message | trace `error.response === undefined` path | ➖ |
| E8 | 5xx errors show generic "something went wrong" message | trace error handler | ➖ |
| E9 | Rate limit (`TOO_MANY_REQUESTS`) shows "try again later" | trace error code dispatch | ➖ |
| E10 | Form re-submission after error does not re-trigger previous toast | trace `toast.promise` lifecycle | ➖ |

## F. Authentication & Authorization (8 items)

| # | Check | How to verify | Automation |
|---|---|---|---|
| F1 | Unauthenticated user cannot access `/profile` (UI redirects) | manual: visit `/profile` while logged out | ➖ |
| F2 | Unauthenticated user cannot access `/profile` (direct API call blocked) | curl `/auth/me` without Bearer → 401 | ➖ |
| F3 | Authenticated user cannot access `/login` (UI redirects) | manual: visit `/login` while logged in | ➖ |
| F4 | Authenticated user cannot bypass `/login` via direct API | n/a (no destructive action behind login page) | ➖ |
| F5 | Account deletion requires password confirmation | trace `deleteAccountSchema` | ➖ |
| F6 | Google OAuth callback handled by backend (FE never sees the code) | trace `GoogleCallback` in BE | ➖ |
| F7 | Sign out from one tab does not affect other tabs within 1s | manual test (broadcast channel or storage event) | ➖ |
| F8 | No client-side route returns sensitive data in `props` (e.g. access token) | grep `accessToken` in `*.tsx` props | ✅ (audit) |

## G. Database & Migrations (8 items)

> **Note:** This section is largely N/A for the FE repo. The DB is managed
> by the backend. Items below are for **contract** verification.

| # | Check | How to verify | Automation |
|---|---|---|---|
| G1 | FE never assumes backend tables directly | grep `prisma\|drizzle\|knex\|mongoose` in `src/` | ✅ (audit) |
| G2 | FE does not have a `database/` directory | `ls src/database` → no such dir | ✅ (audit) |
| G3 | User type in `src/types/auth.types.ts` matches BE `User` struct | compare field by field with `BE: src/modules/auth/types/auth.type.go` | ➖ |
| G4 | FE does not serialize `password_hash`, `oauth_*` fields | grep these strings in `src/types/` | ✅ (audit) |
| G5 | FE `UserRole` is `"user" \| "admin"` strict union | inspect `src/types/auth.types.ts` | ➖ |
| G6 | No FE code references a "session" DB table | grep `session` in `src/` excluding auth store | ➖ |
| G7 | FE reflects backend migration `000007` (drop unused tables) | check BE docs/CHANGELOG | ➖ |
| G8 | `docs/database/schema.md` says FE has no DB layer | read doc, confirm | ➖ |

## H. Security (10 items)

| # | Check | How to verify | Automation | 
|---|---|---|---|
| H1 | No `NEXT_PUBLIC_*` env var holds a secret | grep `process.env.NEXT_PUBLIC_` + manually check `.env.example` | ✅ (audit) |
| H2 | No hardcoded API keys, tokens, passwords in source | grep patterns in `src/` | ✅ (audit) |
| H3 | No `dangerouslySetInnerHTML` outside shadcn-generated | grep in `src/` | ✅ (audit) |
| H4 | No `eval()`, `new Function()`, `setTimeout(string, ...)` | grep in `src/` | ✅ (audit) |
| H5 | Open-redirect prevention on `redirectTo` | inspect `loginSchema` regex | ➖ |
| H6 | `BACKEND_API_URL` fails fast if missing (no empty-string silent fail) | inspect `src/lib/api/client.ts` | ➖ |
| H7 | Cookie scope: refresh cookie path = `/api/v1/auth` (matches BE) | cross-check with BE | ➖ |
| H8 | CSP / security headers: not required for client app, but server config noted | inspect `next.config.ts` | ➖ |
| H9 | XSS via form input: no `innerHTML` assignment | grep `\.innerHTML\s*=` | ✅ (audit) |
| H10 | No `console.log` exposing tokens or PII | grep `console.log` in `src/` | ✅ (audit) |

## I. Code Quality (8 items)

| # | Check | How to verify | Automation |
|---|---|---|---|
| I1 | All files in `src/` use kebab-case (with documented exceptions) | inspect filenames | ✅ (audit) |
| I2 | All component files use PascalCase | inspect component filenames | ✅ (audit) |
| I3 | `src/components/ui/` has no business logic imports | grep imports in `src/components/ui/` | ✅ (audit) |
| I4 | No `src/lib/` file imports from `src/app/` (dependency direction) | grep imports in `src/lib/` | ✅ (audit) |
| I5 | No `src/store/` file imports from `src/hooks/` (dependency direction) | grep imports in `src/store/` | ✅ (audit) |
| I6 | `index.ts` barrel exports are all used (no dead exports) | parse barrel, grep usage | ✅ (audit) |
| I7 | No `// @ts-ignore` (use `@ts-expect-error` with comment) | grep in `src/` | ✅ (audit) |
| I8 | `any` type only in allow-listed files | grep `: any` in `src/` | ✅ (audit) |

## J. Performance (5 items)

| # | Check | How to verify | Automation |
|---|---|---|---|
| J1 | No N+1 in any data fetch (FE has minimal fetching, but check TanStack Query usage) | trace `useQuery` calls | ➖ |
| J2 | Bundle size: no unused dependency in `package.json` | `pnpm dlx depcheck` | ➖ |
| J3 | No synchronous heavy work in render | grep for sync loops in components | ➖ |
| J4 | `useMemo`/`useCallback` only when necessary (not premature) | manual code review | ➖ |
| J5 | Initial JS payload < 200KB gzipped (or noted in `docs/`) | `pnpm build` output | ➖ |

## K. Testing (5 items)

> **Note:** FE has no test script configured yet (`docs/conventions/testing.md`
> is planned). This section is for when tests are added.

| # | Check | How to verify | Automation |
|---|---|---|---|
| K1 | Test script exists in `package.json` | inspect | ✅ (audit) |
| K2 | At least 1 test file exists | `find . -name "*.test.*"` | ✅ (audit) |
| K3 | `mapAuthPayload` has unit test | inspect test files | ➖ |
| K4 | `internalPath` regex has unit test | inspect test files | ➖ |
| K5 | `handleQueryError` dispatch has unit test | inspect test files | ➖ |

## L. Operational (5 items)

| # | Check | How to verify | Automation |
|---|---|---|---|
| L1 | `package.json` has `lint`, `type-check`, `build` scripts | inspect | ✅ (audit) |
| L2 | Pre-commit hook runs `docs:check` and `verify:audit` | inspect `.githooks/pre-commit` | ➖ |
| L3 | CI runs `pnpm verify:all` on every PR | inspect `.github/workflows/ci.yml` | ➖ |
| L4 | `.env.example` documents all required env vars | inspect | ✅ (audit) |
| L5 | No secrets committed (`.env*` ignored except `.env.example`) | inspect `.gitignore` | ➖ |

---

## Audit Summary (fill in)

**Last audit:** YYYY-MM-DD
**Auditor:** <name or "agent">
**Repo version:** <git sha>
**Items total:** 95
**Items passed (✅):** ?
**Items with drift (⚠):** ?
**Items broken (❌):** ?
**Items in progress (⏳):** ?
**Items N/A (➖):** ?
**Items cannot verify (⚪):** ?

**Overall verdict:** 🟢 / 🟡 / 🟠 / 🔴

**Top 3 priorities:**
1. ...
2. ...
3. ...

**Link to full report:** `reports/YYYY-MM-DD-audit.md`

---

## How to extend this checklist

When you add a new check:

1. Add a row to the appropriate section.
2. Mark `Automation: ✅` if a script enforces it, `➖` if manual.
3. If automated, also add the check to
   [`automated-checks.md`](automated-checks.md).
4. Commit with `docs(audit): add <category> check for <description>`.

When you find a new bug:
- Add a row to the relevant section with status ❌
- Open an issue / PR with the fix
- Update status to ✅ when shipped

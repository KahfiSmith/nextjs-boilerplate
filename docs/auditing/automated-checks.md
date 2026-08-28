# Automated Checks

This document inventories all checks that run **automatically** via
`pnpm verify:audit` (and the wider `pnpm verify:all` chain), explains what
each one verifies, and shows how to extend the script.

## Architecture of the verify chain

```
pnpm verify:fast
  ├── pnpm lint              (ESLint)
  ├── pnpm type-check        (tsc --noEmit)
  └── pnpm docs:check        (link + endpoint + feature gate)

pnpm verify:risk             (path-based risk classification)

pnpm verify:cross-repo       (FE↔BE endpoint + error code sync)

pnpm verify:audit            (NEW — internal consistency)
  ├── Naming & structure
  ├── TypeScript hygiene
  ├── Package & env consistency
  ├── Architecture rules (dependency direction)
  ├── Security patterns
  ├── Dead code detection
  └── Test coverage minimum

pnpm verify:all
  └── runs all of the above

pnpm audit:report
  └── generates .audit/report-YYYY-MM-DD.{json,md} from all of the above
```

## Existing scripts (do not reimplement)

| Script | Purpose | Run via |
|---|---|---|
| `scripts/check-docs.mjs` | Link resolution, src path, endpoint sync, feature gate | `pnpm docs:check` |
| `scripts/harness/check-cross-repo.mjs` | FE↔BE endpoint + error code sync | `pnpm verify:cross-repo` |
| `scripts/harness/check-risk.mjs` | Path-based risk classification (low/medium/high) | `pnpm verify:risk` |
| `scripts/harness/check-self-audit.mjs` | **NEW** internal consistency | `pnpm verify:audit` |

## New checks added by `check-self-audit.mjs`

### A. Naming & structure

| Check | What it does | Default |
|---|---|---|
| `A1` | All files in `src/` use kebab-case (except `index.ts`, page conventions) | error |
| `A2` | Component files use PascalCase | warning |
| `A3` | Constant exports in `config/`, `lib/api/` use UPPER_SNAKE_CASE | warning |
| `A4` | No `index.ts` barrel has unused exports (dead code detector) | warning |

### B. TypeScript hygiene

| Check | What it does | Default |
|---|---|---|
| `B1` | No `: any` in production code (excluding tests) | error |
| `B2` | No `console.log` (only `console.error`/`console.warn` allowed) | warning |
| `B3` | No `// @ts-ignore` (use `@ts-expect-error` with reason) | warning |
| `B4` | No `// eslint-disable` without justification comment | warning |

### C. Package & env consistency

| Check | What it does | Default |
|---|---|---|
| `C1` | `package.json` has `lint`, `type-check`, `build` scripts | error |
| `C2` | All `process.env.NEXT_PUBLIC_*` references are listed in `.env.example` | error |
| `C3` | No `process.env.*_SECRET`, `*_KEY`, `*_PASSWORD` in `src/` (must not leak) | error |

### D. Architecture rules

| Check | What it does | Default |
|---|---|---|
| `D1` | No file in `src/components/ui/` imports from `src/lib/api/`, `src/hooks/`, or `src/store/` | error |
| `D2` | No file in `src/lib/` imports from `src/app/` or `src/components/` | error |
| `D3` | No file in `src/store/` imports from `src/hooks/` or `src/app/` | error |
| `D4` | `middleware.ts` is either empty pass-through or has real logic (not a half-stub) | warning |

### E. Security patterns

| Check | What it does | Default |
|---|---|---|
| `E1` | No hardcoded `password`, `secret`, `token`, `api_key` strings in source | error |
| `E2` | No `eval(`, `new Function(`, `setTimeout(string` patterns | error |
| `E3` | No `dangerouslySetInnerHTML` outside shadcn-generated files | warning |
| `E4` | No `.innerHTML =` assignment (XSS vector) | error |

### F. Dead code detection

| Check | What it does | Default |
|---|---|---|
| `F1` | Exports in `index.ts` barrel files that are not imported anywhere else | warning |
| `F2` | Files in `src/` not imported by any other file (excluding entry points) | warning |

### G. Test coverage minimum

| Check | What it does | Default |
|---|---|---|
| `G1` | At least one test file exists in the repo | warning |
| `G2` | If `test` script exists in `package.json`, it must not be empty | warning |

> **Note:** Detailed behavioural tests are not in scope here. See
> `docs/conventions/testing.md` (planned) for that.

## Severity model

Each check produces either:

- **error** — fails the script, exit code 1, blocks CI / commit
- **warning** — printed with `⚠`, does not block (visible in `audit:report`)

Rationale: warnings are valuable signal but not always blocking — for
example, a legacy `console.log` in a non-production code path should be
visible but not necessarily fail a release.

## Allow-lists (false positive mitigation)

Some patterns are legitimately used in specific places. The script
maintains small allow-lists:

```js
// In check-self-audit.mjs:
const ALLOWLIST_B1_ANY = [
  // explicit any is OK in:
  "src/lib/api/error-handler.ts",       // catches all error shapes
  "src/types/common.types.ts",          // Maybe/Nullable are untyped by design
];

const ALLOWLIST_E1_SECRETS = [
  // These contain legitimate non-secret strings matching the pattern:
  "src/lib/api/auth-error-codes.ts",    // "ACCESS_TOKEN_EXPIRED" etc.
];
```

When adding a new check, expect to add 1-2 allow-list entries. Document
each one with a comment explaining why.

## How to add a new check

1. **Edit** `scripts/harness/check-self-audit.mjs`. Add a new section:

   ```js
   // --- H. My new category --------------------------------------------
   for (const f of walk(join(SRC, "..."))) {
     const src = read(f);
     if (src.includes("forbiddenPattern")) {
       errors.push(`Found forbidden pattern in ${f}`);
     }
   }
   ```

2. **Document** it in this file under the corresponding section. Include:
   - What it checks
   - Severity (error or warning)
   - Any allow-list entries needed

3. **Add an item** to `SELF_AUDIT.md` master checklist with
   `Automation: ✅` so the agent/human knows it's covered.

4. **Test** the script: `pnpm verify:audit` should still pass on the
   current state. If it fails because of an existing issue, decide:
   - Fix the issue (preferred)
   - Add to allow-list with explanation
   - Or lower severity to warning

5. **Commit** with a message like:
   ```
   feat(audit): add check for <description>
   ```

## Running

```bash
# Standalone
pnpm verify:audit

# Full chain (includes docs:check, verify:cross-repo, verify:audit)
pnpm verify:all

# Generate aggregated report
pnpm audit:report
```

## Extending to the backend

The backend repo has a parallel `check-self-audit.mjs` with Go-specific
checks. See
[`../../Backend/fiber-boilerplate/docs/auditing/automated-checks.md`](../../Backend/fiber-boilerplate/docs/auditing/automated-checks.md)
for the Go equivalent.

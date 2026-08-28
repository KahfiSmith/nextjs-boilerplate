# Agent Instructions for Self-Audit

If you are an AI agent asked to perform a **deep audit** of this repository,
follow these steps in order. The goal is to produce a single audit report
with concrete, evidence-backed findings.

> **Scope:** "deep audit" = read source + docs, trace flows, compare against
> contract, write findings. This is **in addition** to (not instead of) the
> automated checks. For the quick automated pass, just run `pnpm verify:all`.

---

## Step 1: Setup

```bash
# Verify you are in the right repo and branch
pwd
git status
git log --oneline -5
```

Read the entry-point docs to ground yourself:

1. `docs/README.md` — documentation index
2. `AGENTS.md` — engineering rules for this repo
3. `CHANGELOG.md` — recent changes (especially `[Unreleased]`)
4. `docs/product/roadmap.md` — what is "done" vs "planned"
5. `docs/architecture/overview.md` — system design

## Step 2: Run all automated checks

```bash
pnpm install --frozen-lockfile
pnpm verify:all
```

Each script returns:
- **exit 0** = pass
- **exit 1** = fail with errors printed
- **warnings** (printed with `⚠`) are not blockers but should be noted

Capture full output. If a script fails, that's a **finding by itself** — the
fix may already be obvious, or you may need to dig deeper.

## Step 3: Cross-repo consistency

The companion repo is `../Backend/fiber-boilerplate`. Run from both sides:

```bash
cd ../Backend/fiber-boilerplate && pnpm verify:cross-repo
cd ../Frontend/nextjs-boilerplate && pnpm verify:cross-repo
```

Both must pass. If one fails, you have a **contract drift** — investigate
which repo is the source of truth and which is the outlier.

## Step 4: Trace every "Done" feature end-to-end

For each item marked ✅ in `docs/product/roadmap.md`:

1. Find the FE entry point (page, hook, or component).
2. Trace through `hooks → lib/api → types`.
3. Match against the BE counterpart in
   `../Backend/fiber-boilerplate/src/modules/<feature>/`.
4. Verify request body, response shape, error code handling.

Build a small table per feature:

| Aspect | FE | BE | Sync? | Notes |
|---|---|---|---|---|
| Endpoint | `endpoints.ts:LOGIN` | `auth.controller.go:Login` | ✅ | |
| Request DTO | `loginSchema` | `dto.AuthRequest` | ✅ | |
| Response shape | `BackendAuthPayload` | `dto.AuthResponse` | ✅ | |
| Error code | `INVALID_CREDENTIALS` | `auth.service.go:113` | ✅ | |
| Auth flow | cookie + Bearer | cookie set + Bearer | ✅ | |

## Step 5: Manual checklist review

Open [SELF_AUDIT.md](SELF_AUDIT.md) and walk through every item. For each
one:

- Items with `Automation: ✅` — confirm the script passed.
- Items with `Automation: ➖` — you must verify manually.

For each manual item:
1. Read the relevant source file
2. Trace the flow
3. Document your evidence (file:line)
4. Mark the status: ✅ pass, ⚠️ drift, ❌ broken, ➖ N/A, ⏳ in progress

If you cannot verify, mark as ⚪ **Cannot be verified** — be honest.

## Step 6: Generate the report

Fill the template from [checklist-template.md](checklist-template.md). Save
the report as:

```
docs/auditing/reports/YYYY-MM-DD-audit.md
```

Commit the report (do not push — the human team reviews before publishing).

## Step 7: Don't modify source code

This is a **read-only audit**. If you find issues:

1. Document them in the report (severity, evidence, recommendation)
2. Do NOT edit source files
3. Let the human team decide what to fix and when

If the user explicitly asked you to also fix the issues, switch out of
read-only mode and use the normal implementation flow.

---

## Rules of thumb

These rules are derived from the audit that produced this framework. Follow
them and your audit will be high-quality.

### Be skeptical

A file with a suggestive name is not proof of correct behaviour.

```ts
// ❌ Don't trust the name
// security.ts
export function hash(s: string) {
  return btoa(s);  // ← this is base64, not a hash
}
```

Trace the actual implementation. Open the file. Read every relevant line.

### Cite evidence

Every finding must have:
- **What** is wrong
- **Where** (file:line)
- **Why** it matters (impact)
- **How** to fix (recommendation)

A finding without evidence is not a finding. A finding without impact is
just a preference.

### Distinguish categories

- ** Bug** — incorrect behaviour, broken contract, security hole
- ** Risk** — works today, but fragile or dangerous in edge cases
- ** Improvement** — would be better with this change, but not broken
- ** Preference** — style/taste, not a quality issue

Don't mix them. A "preference" reported as a "bug" loses credibility.

### Don't recommend over-engineering

If something is simple and correct, don't suggest a refactor "for
consistency". If a check is paranoid, mark it as nice-to-have, not a blocker.

When in doubt, prefer **KISS** — keep the audit small and actionable.

### Don't recommend tech/libraries

Unless the current stack is genuinely broken, don't suggest switching to a
different library. The user picked this stack for a reason.

### Be honest about uncertainty

If you can't verify something (e.g. behaviour depends on a runtime that
isn't running in this audit), say so. Mark as ⚪ Cannot be verified, explain
what you would need to verify it.

---

## Output contract

Your final response to the user must include:

1. **Summary** — 3-5 sentences on overall health
2. **Feature Traceability Matrix** — table of requirements vs implementation
3. **Findings** — grouped by severity (MUST / SHOULD / NICE / DO NOT)
4. **Cross-repo sync verdict** — endpoint / DTO / error code status
5. **Action plan** — P0/P1/P2/P3 prioritized
6. **Overall verdict** — 🟢 / 🟡 / 🟠 / 🔴
7. **File saved** — `docs/auditing/reports/YYYY-MM-DD-audit.md`

Do not implement any code changes from the audit. That is a separate
workflow.

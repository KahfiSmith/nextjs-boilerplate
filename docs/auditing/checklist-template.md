# Audit Report Template

Copy this template to `docs/auditing/reports/YYYY-MM-DD-audit.md` and fill
in every section. The structure below is **mandatory** — automated tooling
parses these reports for trend tracking.

---

```markdown
# Audit Report — YYYY-MM-DD

> **Repo:** nextjs-boilerplate (FE) / fiber-boilerplate (BE)
> **Branch / commit:** <branch> @ <short-sha>
> **Auditor:** <name or "agent">
> **Scope:** full / partial (specify)
> **Related:** previous report `reports/YYYY-MM-DD-prev.md` (if any)

## 1. Summary

<3-5 sentences. What is the overall health of the repo? What changed since
the last audit? Any structural concerns?>

## 2. Automated check results

| Script | Status | Errors | Warnings | Notes |
|---|---|---|---|---|
| `pnpm docs:check` | ✅ / ❌ | 0 | 0 | |
| `pnpm verify:risk` | ✅ / ⚠ | — | 0 | |
| `pnpm verify:cross-repo` | ✅ / ❌ | 0 | 0 | |
| `pnpm verify:audit` | ✅ / ❌ | 0 | 0 | |

If any script failed, paste the relevant error block here.

## 3. Feature Traceability Matrix

For every "Done" item in `docs/product/roadmap.md`:

| # | Requirement | FE impl | BE impl | Status | Notes |
|---|---|---|---|---|---|
| 1 | Login | `useLogin` + `LoginForm` | `/auth/login` | ✅ | |
| 2 | Register | ... | ... | ✅ / ⚠ / 🟡 / ❌ | |
| 3 | Logout | ... | ... | ... | |
| 4 | Refresh | ... | ... | ... | |
| 5 | Google OAuth | ... | ... | ... | |
| 6 | Delete account | ... | ... | ... | |
| ... | | | | | |

Use status legend: ✅ implemented & synced | ⚠️ implemented but different
| 🟡 partial | ❌ missing | 🔵 implemented but undocumented | ⚪ cannot verify

## 4. Findings

### 4.1 MUST FIX (P0)

Issues that could cause bugs, security holes, data corruption, or violated
requirements. Must be fixed before merge / release.

#### BUG-1: <title>
- **Severity:** Critical / High
- **Category:** Bug / Risk / Security / Data integrity
- **Evidence:** `path/to/file.ts:42`
- **Expected:** <what should happen per docs / contract>
- **Actual:** <what actually happens>
- **Impact:** <who is affected, how>
- **Recommendation:** <concrete fix, code snippet optional>

(repeat per finding)

### 4.2 SHOULD FIX (P1)

Issues that affect maintainability, reliability, UX, consistency, or
performance. Not immediately broken but should be addressed soon.

(format same as above)

### 4.3 NICE TO HAVE (P2 / P3)

Improvements that are valuable but not urgent. Format same as above.

### 4.4 DO NOT CHANGE

Items that look like they could be refactored but are correct as-is. Add
this section to prevent the same comment from recurring in future audits.

- <item>: <why current implementation is correct>

## 5. Cross-repo sync

| Aspect | Status | Notes |
|---|---|---|
| Endpoint paths | ✅ / ⚠ | <details> |
| Error codes | ✅ / ⚠ | <details> |
| Request DTOs | ✅ / ⚠ | <details> |
| Response shapes | ✅ / ⚠ | <details> |
| User model | ✅ / ⚠ | <details> |
| Cookie config | ✅ / ⚠ | <details> |
| Refresh flow | ✅ / ⚠ | <details> |
| OAuth flow | ✅ / ⚠ | <details> |

## 6. Action plan

| Priority | Item | Owner | File | Complexity |
|---|---|---|---|---|
| P0 | BUG-1 | @dev | `path/to/file.ts:42` | Low |
| P0 | BUG-2 | @dev | ... | Low |
| P1 | ... | ... | ... | ... |
| P2 | ... | ... | ... | ... |
| P3 | ... | ... | ... | ... |

## 7. Overall verdict

<one of:>

- 🟢 **Ready** — no P0/P1 issues, ship it
- 🟢 **Ready with Minor Improvements** — at most 1-2 P1, no P0
- 🟡 **Mostly Ready, Several Improvements Required** — multiple P1, no P0
- 🟠 **Significant Fixes Required** — 1+ P0 issues
- 🔴 **Not Ready** — major architectural or security problems

**Reasoning:**
<2-3 sentences explaining the verdict based on evidence above>

## 8. Sign-off

- [ ] Reviewed by: <name>
- [ ] Action plan created: <link to issue / PR>
- [ ] Plan approved: <date>
- [ ] Next audit: <date + trigger, e.g. "after next refactor">

---

## Appendix: SELF_AUDIT.md status

(For each section in SELF_AUDIT.md, mark the aggregate status. Useful for
spotting trends across audits.)

| Section | Items | ✅ | ⚠ | ❌ | ➖ | Notes |
|---|---|---|---|---|---|---|
| A. Documentation sync | 8 | | | | | |
| B. Feature completeness | 10 | | | | | |
| C. Functional correctness | 8 | | | | | |
| D. Business logic | 10 | | | | | |
| E. Validation & error handling | 10 | | | | | |
| F. Auth & authorization | 8 | | | | | |
| G. Database & migrations | 8 | | | | | (n/a for FE) |
| H. Security | 10 | | | | | |
| I. Code quality | 8 | | | | | |
| J. Performance | 5 | | | | | |
| K. Testing | 5 | | | | | |
| L. Operational | 5 | | | | | |
| **Total** | **95** | | | | | |
```

---

## How to use this template

1. **Copy** the entire code block above
2. **Save** to `docs/auditing/reports/YYYY-MM-DD-audit.md` (today's date)
3. **Fill in** every section. Don't leave placeholders.
4. **Be concise** in findings — evidence + impact + recommendation is the
   minimum, not optional.
5. **Commit** the report (don't push). The human team reviews before merge.
6. **Reference** previous reports in the new one to track trends.

If you need to deviate from this structure (e.g. partial audit scope), note
it clearly at the top.

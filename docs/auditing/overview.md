# Auditing

This directory contains the **self-audit framework** for this repository. It
defines what "this repo is healthy" means in concrete, testable terms, and
provides the tools (docs + scripts + hooks + CI) to enforce it.

The goal is **drift prevention**: as features are added and refactored, the
repo stays consistent with its own contract — documentation matches code,
patterns stay consistent, security invariants hold.

## Contents

| File | Purpose | Audience |
|---|---|---|
| [SELF_AUDIT.md](SELF_AUDIT.md) | **Master checklist** — 95 testable items grouped by area, with status fields. The single source of truth for "is this repo healthy?". | Agent / auditor / reviewer |
| [agent-instructions.md](agent-instructions.md) | Step-by-step instructions for an AI agent asked to run a deep audit. | AI agent |
| [checklist-template.md](checklist-template.md) | Markdown template for a completed audit report. Fill in, save to `reports/`, commit. | Auditor (human or agent) |
| [automated-checks.md](automated-checks.md) | Inventory of all checks that run automatically via `pnpm verify:audit` and how to extend the script. | Maintainer |

## How the layers work

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Markdown checklist (SELF_AUDIT.md)                          │
│    95 items, status boxes, run by agent or human               │
│    Covers everything: docs, code, security, perf, testing      │
└──────────────────────┬──────────────────────────────────────────┘
                       │ items tagged "Automation: ✅" are also
                       ▼ enforced by script
┌─────────────────────────────────────────────────────────────────┐
│ 2. Auto script (scripts/harness/check-self-audit.mjs)          │
│    ~25 machine-checkable items. exit 1 on failure.            │
│    Catches: dead code, naming, env leaks, layer violations,    │
│    forbidden patterns, missing tests.                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │ part of verify:all chain
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Verdict generator (scripts/harness/audit-report.mjs)        │
│    Aggregates docs:check + verify:risk + verify:cross-repo     │
│    + verify:audit into one JSON + markdown report              │
│    Saved to .audit/ for trend tracking                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │ wired into
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Enforce (CI + pre-commit)                                    │
│    pre-commit runs docs:check + verify:audit                   │
│    GitHub Actions runs full verify:all on every PR             │
│    Mismatch = build red = block merge                          │
└─────────────────────────────────────────────────────────────────┘
```

## When to run

| Trigger | What to run |
|---|---|
| Before every commit | Pre-commit hook (auto) |
| Every PR | CI runs `verify:all` (auto) |
| Before a release | `pnpm audit:report` to produce a release-time snapshot |
| After a major refactor | Deep audit via [agent-instructions.md](agent-instructions.md) |
| Quarterly | Deep audit + trend review against prior reports |

## What this is NOT

- **Not a replacement for deep audits.** A thorough audit (like the one that
  produced the bug list in `CHANGELOG.md`) requires tracing implementation
  end-to-end, reading docs, asking questions. This framework is the
  automated safety net, not the auditor.
- **Not a style linter.** We have `pnpm lint` for that. This framework
  enforces architectural and contract invariants, not formatting.
- **Not a test suite.** It runs static analysis on source files. For
  behavioural tests, see `docs/conventions/testing.md` (planned).

## How to extend

See [automated-checks.md](automated-checks.md#how-to-add-a-new-check). Adding
a new check is a 3-step process: edit the script, document it here, add an
item to the master checklist.

## Related

- [Verify harness commands](../development/workflow.md#verification-harness)
- [Cross-repo sync](../development/workflow.md#cross-repo-sync)
- [Architecture decision records](../architecture/adr/README.md)

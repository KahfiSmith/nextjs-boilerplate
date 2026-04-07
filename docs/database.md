# Database Guide

This document defines database workflow and safety rules for this repository.

## Current Status

- No database client, ORM, or migration tool is wired into the current codebase.
- `DATABASE_URL` exists in `.env.example`, but the current runtime does not consume it.
- There is no active repository layer in the tree today.
- If persistence is introduced later, document the chosen approach before expanding the data layer.

## Intended Integration Boundary

When database-backed features are added:

- keep route or page boundaries thin
- put business rules in `src/services/*`
- introduce a dedicated persistence layer only when there is real data access to centralize
- document the chosen location and conventions in `docs/architecture.md`

If a repository layer is introduced later, add it intentionally instead of assuming an old scaffold still exists.

## Environment Variables

- `DATABASE_URL` is reserved for future database usage.
- Keep secrets only in local env files such as `.env.local`.
- Never commit real credentials.

## Recommended Workflow

### Local Development

- Choose one database stack first, such as Prisma, Drizzle, or direct SQL.
- Add only the scripts that are backed by real project files and installed tooling.
- Keep local setup reproducible through committed config and documented commands.

### Shared Environments

- Do not use direct schema push against shared databases.
- Use versioned migrations by default.
- Require a rollback plan for risky changes.

## Change Rules

Every persistence change must update:

1. the active implementation files
2. `docs/api.md` if endpoint behavior changes
3. `docs/architecture.md` if new layers or boundaries are introduced
4. this file when workflow or safety policy changes
5. `.env.example` if new database env vars are required

## Safety Checklist

- Confirm the target database before executing commands.
- Never run destructive operations without a backup or rollback plan.
- Ensure seed data does not contain secrets or sensitive personal data.

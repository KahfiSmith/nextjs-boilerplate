# Database Guide

This document defines database workflow and safety rules for this fullstack repository.

## Purpose
- Keep database changes predictable across local, staging, and production.
- Prevent accidental schema drift from direct push commands.

## Current Setup
- Repository includes database scaffold scripts in `package.json`:
  - `pnpm db:push`
  - `pnpm db:studio`
  - `pnpm db:seed`
- Current DB-related folders are scaffolded:
  - `src/lib/db`
  - `src/lib/repositories`
  - `src/lib/services`

## Environment Variables
- `DATABASE_URL` is required when running database commands.
- Keep secrets only in local env files (`.env.local`) and never commit real credentials.

## Recommended Workflow

### Local Development
- `db:push` is acceptable for rapid local prototyping.
- `db:studio` is optional for data inspection.
- `db:seed` can be used for local test data.

### Shared Environments (Staging/Production)
- Do not use direct schema push to production databases.
- Use versioned migration files as the default approach.
- Require rollback strategy for risky changes.

## Change Rules
- Every schema or persistence change must update:
  1. repository/service code (as needed)
  2. API contract in `docs/api.md` (if endpoint payload/behavior changes)
  3. this file (`docs/database.md`) when workflow/policy changes

## Safety Checklist
- Confirm target DB is correct before executing DB commands.
- Never run destructive operations without backup or rollback plan.
- Ensure seed data does not contain secrets or sensitive personal data.

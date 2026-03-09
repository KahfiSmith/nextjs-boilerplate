# Database Guide

This document defines database workflow and safety rules for this fullstack repository.

## Purpose
- Keep database changes predictable across local, staging, and production.
- Prevent accidental schema drift from direct push commands.

## Current Setup
- No database CLI tooling is installed by default in this boilerplate.
- Active persistence-related application code currently lives in:
  - `src/lib/repositories`
  - `src/lib/services`
- Add `src/lib/db` and database scripts only when a concrete database implementation is introduced.

## Environment Variables
- `DATABASE_URL` is required when running database commands.
- Keep secrets only in local env files (`.env.local`) and never commit real credentials.

## Recommended Workflow

### Local Development
- Choose one database stack first (for example Prisma, Drizzle, or direct SQL).
- Add only the scripts that are backed by real project files and installed tooling.
- Keep local setup reproducible through committed config and documented commands.

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

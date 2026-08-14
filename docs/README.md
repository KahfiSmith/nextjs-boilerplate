# Documentation Directory

These documents distinguish implemented behavior from planned work. Accepted
architecture and conventions live in the current sources of truth; planned
capabilities are called out explicitly rather than described as if they exist.

This is the frontend (`nextjs-boilerplate`) repository. The companion backend
is `fiber-boilerplate` (Go Fiber); its contract is linked from the
[API](api/overview.md) and [Architecture](architecture/overview.md) docs.

## Current sources of truth

- [Architecture](architecture/overview.md) - System design, folder structure, data flow, ADRs.
- [Folder Structure & Dependency Rules](architecture/folder-structure.md) - Directory tree, ownership, dependency rules.
- [API](api/overview.md) - Backend contract, Axios clients, query config.
- [Authentication API & Errors](api/authentication.md) - Endpoints, envelope, error codes.
- [Security](security/overview.md) - Trust boundaries, authentication, authorization.
- [Secrets & Security Rules](security/secrets.md) - Env vars, secrets management, rules.
- [Coding Standards & Naming](conventions/coding.md) - TS, lint, components, imports, styling, naming.
- [Validation](conventions/validation.md) - Zod schemas and form wiring.
- [Error Handling & Logging](conventions/error-handling.md) - Error paths, logging rules.
- [Testing](conventions/testing.md) - Current status and guidance.
- [Development](development/setup.md) - Setup, commands, environment.
- [Workflow](development/workflow.md) - Implementation patterns, handoff checklist.
- [Debugging](development/debugging.md) - Common checks and failure modes.
- [Features](features/authentication.md) - Implemented feature modules (authentication and user session).
- [Product](product/overview.md) - Product status, business rules, terminology.
- [Database](database/schema.md) - Database notes (managed by the backend service).
- [Infrastructure](infrastructure/deployment.md) - Environments, deployment, CI/CD.
- [Observability](infrastructure/observability.md) - Current signals and planned tooling.
- [Verification harness](development/workflow.md) - `verify:*` commands, risk classification, cross-repo sync.

## Planned, not yet implemented

The following are intentionally not described as implemented:

- Server-side auth or API routes (`src/app/api/**`) - none exist; route protection is client-side.
- Middleware-enforced access control - `middleware.ts` is a pass-through.
- Test suite - no test script is configured yet.
- Observability tooling - not configured.
- Database layer - managed by the Go Fiber backend, not this frontend repo.

When a planned capability is shipped, promote only its durable decisions into
the current sources of truth.

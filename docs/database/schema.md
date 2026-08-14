# Database

The database is managed by the Go Fiber backend service. This repository is a
frontend-only application and has no database layer of its own.

## What this repo does NOT have

- No ORM or database client.
- No migrations or schema definitions.
- No repository/data-access layer.
- No entity relationships.

See the backend project for schema definitions, migration guidelines, and
entity relationships.

## When to add

Per the repository guidelines, `src/lib/repositories` is reserved for a
concrete feature that needs data access. Do not add a database layer until a
feature requires it.

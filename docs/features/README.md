# Features Documentation

Overview of business features implemented in this application.

## Implemented features

- [Authentication & User Session](./authentication.md) - login, register,
  logout, session bootstrap, protected profile, delete account.

## Route-group coverage

Every route group under `src/app/` must be documented here. The
`docs:check` gate fails when a route group has no feature doc.

- `(auth)` - covered by [authentication.md](./authentication.md).
- `(dashboard)` - the protected profile surface is part of
  [authentication.md](./authentication.md).
- `(public)` - the landing page is a thin shell over the auth surface; see
  [product overview](../product/overview.md).

## Adding a new feature

1. Create the route group under `src/app/`.
2. Copy `docs/features/_TEMPLATE.md` to `docs/features/<group>.md`.
3. Fill in Overview, Core flow, Implementation map, Endpoints.
4. Add it to the list above.

Feature docs must describe only implemented behavior. When a feature ships,
promote its durable decisions here.

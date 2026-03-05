# API Contract (Next.js App Router)

This document is the source of truth for endpoint contracts in this repository.
Every endpoint change must be synchronized here.

## Global Conventions
- Runtime: Next.js App Router Route Handlers (`src/app/api/**/route.ts`)
- Default content type: `application/json`
- Success response: keep a consistent shape per endpoint (prefer `{ data: ... }` or `{ message: "..." }`)
- Error response: `{ error: "..." }`
- Status code guideline:
  - `200` successful read or update
  - `201` resource created
  - `400` invalid input
  - `401` unauthorized
  - `403` forbidden
  - `404` not found
  - `409` conflict
  - `422` semantic validation error (optional if used consistently)
- `500` internal error

## Route Placement
- Create API endpoints only in `src/app/api/<resource>/route.ts`.
- For ID-specific endpoints use `src/app/api/<resource>/[id]/route.ts`.
- Keep `route.ts` as HTTP boundary only, then delegate to `services -> repositories -> clients`.

## Auth Conventions
- Protected endpoints must apply consistent auth checks (middleware, route handler, or service based on active design).
- Do not expose internal auth details in client-facing errors.
- Auth behavior is controlled by `AUTH_STRATEGY`:
  - `nextauth`: enable NextAuth route + middleware checks
  - `external`: disable NextAuth route, use external backend-managed auth flow
  - `none`: disable auth checks

## Endpoint Registry
Use this table as a quick index of active endpoints.

| Method | Path | Auth | Owner Layer | Notes |
| --- | --- | --- | --- | --- |
| `GET`,`POST` | `/api/auth/[...nextauth]` | Public (entrypoint), internally validated by Auth.js | Handler + service + repository + external client | NextAuth credentials flow delegates credential verification to external backend API |
| `GET` | `/api/health` | Public | Handler | Health check endpoint |

### GET/POST /api/auth/[...nextauth]

- Auth: Public endpoint surface for auth lifecycle; credential verification is protected by server-side validation.
- Handler: `src/app/api/auth/[...nextauth]/route.ts`
- Auth config: `src/lib/auth/config.ts`
- Service: `src/lib/services/auth.service.ts`
- Repository: `src/lib/repositories/auth.repository.ts`
- External client: `src/lib/clients/auth.client.ts`

Request
- Route is managed by NextAuth internal sub-paths (`/signin`, `/callback`, `/session`, `/csrf`, `/signout`).
- Credentials sign-in expects:
```json
{
  "email": "string",
  "password": "string"
}
```

Response
- 2xx:
```json
{ "url": "..." }
```
or session payload depending on sub-route (`/session`).
- 401/4xx:
```json
{ "error": "CredentialsSignin" }
```

Notes
- Backward compatibility: endpoint follows NextAuth default route contract.
- Validation rules: `authenticateWithCredentials` sanitizes and validates required fields before repository lookup.
- External auth source: when `AUTH_MODE=external`, repository calls `${BACKEND_API_URL}${BACKEND_AUTH_LOGIN_PATH}` for credential verification.
- Side effects: creates and rotates auth session cookies when login succeeds.

### GET /api/health
- Handler: `src/app/api/health/route.ts`
- Current behavior:
```json
{ "data": { "status": "ok" } }
```

## Boilerplate Endpoint Pattern
- Collection endpoint: `src/app/api/<resource>/route.ts`
- Item endpoint: `src/app/api/<resource>/[id]/route.ts`
- Nested endpoint: `src/app/api/<resource>/[id]/<sub-resource>/route.ts`

## Endpoint Template (Copy Per Endpoint)
````md
### METHOD /api/...

- Auth: Public | Protected
- Handler: `src/app/api/.../route.ts`
- Service: `src/lib/services/...` (if any)
- Repository: `src/lib/repositories/...` (if any)

Request
- Query params:
- Body schema:

Response
- 2xx:
```json
{ "data": {} }
```
- 4xx/5xx:
```json
{ "error": "..." }
```

Notes
- Backward compatibility:
- Validation rules:
- Side effects:
```
````

## API Change Checklist
- Route handler implementation is synchronized with this document.
- Request and response schemas or types are synchronized.
- Status codes are consistent.
- Happy path and error path are manually tested.

# API Contract

This document is the source of truth for endpoint contracts in this repository.

## Current Status

There are currently no active route handlers under `src/app/api`.

The current auth bootstrap does not use API routes. It relies on a serialized cookie session plus middleware and server-side guards.

As of the current tree:

- `src/app/api` does not exist
- there is no live `/api/health` route
- there is no live NextAuth route handler
- the example Jest file `src/__tests__/health-route.test.ts` is stale and still imports a removed route

Do not document planned endpoints here as if they were already implemented.

## Conventions for Future API Routes

- Runtime: Next.js App Router Route Handlers in `src/app/api/**/route.ts`
- Default content type: `application/json`
- Success response: keep a consistent shape per endpoint, preferably `{ data: ... }` or `{ message: "..." }`
- Error response: `{ error: "..." }`
- Status code guideline:
  - `200` successful read or update
  - `201` resource created
  - `400` invalid input
  - `401` unauthorized
  - `403` forbidden
  - `404` not found
  - `409` conflict
  - `422` validation error when used consistently
  - `500` internal error

## Route Placement

- Collection endpoint: `src/app/api/<resource>/route.ts`
- Item endpoint: `src/app/api/<resource>/[id]/route.ts`
- Nested endpoint: `src/app/api/<resource>/[id]/<sub-resource>/route.ts`

Keep `route.ts` as the HTTP boundary only, then delegate reusable logic to `src/services/*` or another focused helper layer.

## Endpoint Template

````md
### METHOD /api/...

- Auth: Public | Protected
- Handler: `src/app/api/.../route.ts`
- Service or helper: `src/services/...` or another explicit module

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
````

## API Change Checklist

- The route file exists in `src/app/api`.
- Request and response contracts are synchronized with implementation.
- Status codes are consistent.
- Tests target the active route, not removed scaffolding.

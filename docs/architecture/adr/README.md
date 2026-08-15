# Architecture Decision Records (ADRs)

Directory housing architectural choices and technical designs.

- [ADR-001: In-Memory Auth Session with HttpOnly Refresh Cookie](./ADR-001-in-memory-auth-session.md) - access tokens in memory, refresh tokens in backend cookies.
- [ADR-002: Single-Flight Token Refresh in the Axios Interceptor](./ADR-002-single-flight-refresh.md) - one shared refresh promise for concurrent 401s.
- [ADR-003: Client-Side Route Guards over Middleware](./ADR-003-client-side-route-guards.md) - page-level guards; `middleware.ts` is a pass-through.

New ADRs should record a context, a decision, a consequence, and a status.

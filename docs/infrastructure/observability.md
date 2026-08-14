# Observability

## Current signals

No dedicated observability tooling (metrics, tracing, error tracking) is
configured. Current signals are limited to:

- Console errors in development only (`handleQueryError` logs when
  `NODE_ENV === "development"`).
- User-facing toasts via sonner (form success/error).
- React Query error handling (retry policy, cache invalidation).

## Planned improvements

- Error reporting for client-side errors (e.g. Sentry).
- Request logging for API calls.
- Performance monitoring.

None of the planned tooling is implemented yet.

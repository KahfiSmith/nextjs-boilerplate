# Testing Conventions

## Current status

There is **no test script configured** in `package.json`. The current quality
gates are:

```bash
pnpm lint
pnpm type-check
pnpm build
```

## When tests are added

Per the repository guidelines, add focused tests when behavior requires them:

- **Components**: render and interaction checks for feature components
  (e.g. form validation states, logout button).
- **Hooks**: mutation success/error paths for `useLogin`, `useLogout`,
  `useRegister`.
- **API layer**: interceptor behavior (unwrap, single-flight refresh, `_retry`).

A test runner (e.g. Vitest) and a `test` script should be introduced only when
there is concrete behavior to lock down.

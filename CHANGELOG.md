# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Restructured documentation hierarchy into nested domain directories under `docs/`.
- Aligned documentation with the current repository structure (auth endpoints, dependency rules, folder tree, API envelope, middleware behavior).
- Deepened documentation to match the reference style: tables, ownership maps, data-flow diagrams, and explicit implemented-vs-planned framing.
- Consolidated overlapping documentation files to reduce count and length (36 files down to 22).
- Added `pnpm docs:check` validation script and pre-commit hook to keep docs in sync with the repo.

### Added
- Delete account flow on the profile page (`useDeleteAccount` + `DeleteAccountButton`, wired to `DELETE /api/v1/auth/account`).
- Verification harness: `verify:fast`/`verify`/`verify:all` scripts, risk classification (`verify:risk`), and cross-repo sync check (`verify:cross-repo`).
- GitHub Actions CI (`.github/workflows/ci.yml`): lint, type-check, docs, build, risk classification.

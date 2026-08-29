#!/usr/bin/env node
/**
 * verify:audit — internal consistency checks for this repo.
 *
 * Builds on top of docs:check (link + endpoint + feature gate) and
 * verify:cross-repo (FE↔BE sync) with checks that are specific to this
 * single repo's code quality and architectural rules.
 *
 * Each check produces either:
 *   - error:   exit code 1, blocks CI/commit
 *   - warning: printed with ⚠, does not block
 *
 * Run via: pnpm verify:audit
 *
 * Add new checks: see docs/auditing/automated-checks.md
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const PACKAGE = join(ROOT, "package.json");
const ENV_EXAMPLE = join(ROOT, ".env.example");
const MIDDLEWARE = join(ROOT, "middleware.ts");

const errors = [];
const warnings = [];

function read(p) {
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function walk(dir, exts = []) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) out.push(...walk(full, exts));
    else if (exts.length === 0 || exts.some((x) => full.endsWith(x)))
      out.push(full);
  }
  return out;
}

function srcFiles() {
  return walk(SRC, [".ts", ".tsx"]);
}

function recordError(file, msg) {
  errors.push(`${relative(ROOT, file)}: ${msg}`);
}
function recordWarning(file, msg) {
  warnings.push(`${relative(ROOT, file)}: ${msg}`);
}

// ============================================================================
// A. Naming & structure
// ============================================================================
{
  // A1: kebab-case for non-component files. Components (PascalCase export) and
  //     entry points (page.tsx, layout.tsx, route.ts, loading.tsx, etc.) are
  //     exempt.
  const ENTRY_POINTS = new Set([
    "page.tsx",
    "layout.tsx",
    "loading.tsx",
    "error.tsx",
    "not-found.tsx",
    "route.ts",
    "middleware.ts",
    "global-error.tsx",
  ]);
  const COMPONENT_SUFFIX = [".component.tsx", ".stories.tsx"];

  for (const f of srcFiles()) {
    const name = basename(f);
    if (ENTRY_POINTS.has(name)) continue;
    if (COMPONENT_SUFFIX.some((s) => name.endsWith(s))) continue;
    if (name === "index.ts" || name === "index.tsx") continue;
    if (name.includes(".test.") || name.includes(".spec.")) continue;

    // Skip type/interface files that conventionally use .types.ts suffix (also
    // kebab-case prefix; we check the base name only).
    const base = name.replace(extname(name), "");
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(base) && !/^[A-Z]/.test(base)) {
      recordWarning(f, `filename not in kebab-case or PascalCase: ${name}`);
    }
  }
}

// A2: index.ts barrel export usage is checked in F1 (dead code) below.

// ============================================================================
// B. TypeScript hygiene
// ============================================================================
{
  // B1: no `: any` in production code (allow-list of legitimate cases).
  const ALLOWLIST_ANY = new Set([
    // ApiError and toApiErrorMessage accept `unknown`/`any` for unknown error
    // shapes from axios. By design.
    "src/lib/api/error-handler.ts",
  ]);

  for (const f of srcFiles()) {
    if (f.includes(".test.") || f.includes(".spec.")) continue;
    const rel = relative(ROOT, f);
    if (ALLOWLIST_ANY.has(rel)) continue;
    const src = read(f);
    if (!src) continue;
    // Match `: any` (with non-space before to avoid `// many` etc).
    const matches = src.match(/:\s*any(\b|[^a-zA-Z0-9_])/g);
    if (matches) {
      recordError(f, `found ${matches.length} use(s) of ': any'`);
    }
  }
}

{
  // B2: no console.log (allow console.error / console.warn).
  for (const f of srcFiles()) {
    if (f.includes(".test.") || f.includes(".spec.")) continue;
    const src = read(f);
    if (!src) continue;
    const matches = src.match(/console\.log\s*\(/g);
    if (matches) {
      recordWarning(f, `found ${matches.length} use(s) of console.log (use console.error or console.warn)`);
    }
  }
}

{
  // B3: no `// @ts-ignore` (use @ts-expect-error).
  for (const f of srcFiles()) {
    const src = read(f);
    if (!src) continue;
    const matches = src.match(/@ts-ignore/g);
    if (matches) {
      recordWarning(f, `found ${matches.length} use(s) of @ts-ignore (prefer @ts-expect-error with a reason)`);
    }
  }
}

{
  // B4: no `// eslint-disable` without justification. The disable directive
  //     itself often includes a rule name (e.g. `// eslint-disable-next-line
  //     no-console`) which serves as its own justification. We only flag
  //     blanket `// eslint-disable` (no rule name, no preceding comment).
  for (const f of srcFiles()) {
    const src = read(f);
    if (!src) continue;
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const m = line.match(/\/\/\s*eslint-disable(?:-next-line|-line)?(?:\s+(.*))?$/);
      if (!m) continue;

      // If the disable mentions specific rules, treat as justified.
      if (m[1] && m[1].trim().length > 0) continue;

      // Otherwise, check for a comment on the line above.
      if (i > 0) {
        const prev = lines[i - 1].trim();
        if (prev.startsWith("//") || prev.startsWith("*")) continue;
      }
      recordWarning(
        f,
        `eslint-disable on line ${i + 1} without a rule name or justification comment`
      );
    }
  }
}

// ============================================================================
// C. Package & env consistency
// ============================================================================
{
  // C1: required scripts exist in package.json.
  if (existsSync(PACKAGE)) {
    const pkg = JSON.parse(read(PACKAGE));
    const required = ["lint", "type-check", "build", "docs:check"];
    for (const s of required) {
      if (!pkg.scripts?.[s]) {
        errors.push(`package.json: missing required script "${s}"`);
      }
    }
  } else {
    errors.push("package.json not found");
  }
}

{
  // C2/C3: process.env usage must match .env.example entries; no secrets in
  //         NEXT_PUBLIC_* or *_SECRET/*_KEY/*_PASSWORD.
  const envSrc = read(ENV_EXAMPLE);
  const declaredKeys = new Set();
  if (envSrc) {
    for (const m of envSrc.matchAll(/^([A-Z_][A-Z0-9_]*)=/gm)) {
      declaredKeys.add(m[1]);
    }
  }

  for (const f of srcFiles()) {
    const src = read(f);
    if (!src) continue;
    for (const m of src.matchAll(/process\.env\.([A-Z_][A-Z0-9_]*)/g)) {
      const key = m[1];

      // Disallow secret-like keys in client-side code.
      if (/(SECRET|KEY|PASSWORD|TOKEN|PRIVATE)/.test(key) && key.startsWith("NEXT_PUBLIC_")) {
        recordError(
          f,
          `process.env.${key} — NEXT_PUBLIC_ must NEVER hold secrets (per docs/security/secrets.md)`
        );
        continue;
      }

      // NEXT_PUBLIC_* must be declared in .env.example.
      if (key.startsWith("NEXT_PUBLIC_") && envSrc && !declaredKeys.has(key)) {
        recordError(
          f,
          `process.env.${key} used in code but not declared in .env.example`
        );
      }
    }
  }
}

// ============================================================================
// D. Architecture rules (dependency direction)
// ============================================================================
{
  // D1: src/components/ui/* must not import from lib/api, hooks, store.
  for (const f of walk(join(SRC, "components", "ui"))) {
    if (!f.endsWith(".ts") && !f.endsWith(".tsx")) continue;
    const src = read(f);
    if (!src) continue;
    for (const banned of ["@/lib/api", "@/hooks", "@/store"]) {
      if (src.includes(`from "${banned}"`) || src.includes(`from '${banned}'`)) {
        recordError(f, `components/ui must not import from ${banned}`);
      }
    }
  }
}

{
  // D2: src/lib/* must not import from src/app or src/components.
  for (const f of walk(join(SRC, "lib"))) {
    if (!f.endsWith(".ts") && !f.endsWith(".tsx")) continue;
    const src = read(f);
    if (!src) continue;
    for (const banned of ["@/app/", "@/components/"]) {
      if (src.includes(`from "${banned}`) || src.includes(`from '${banned}`)) {
        recordError(f, `lib must not import from ${banned}`);
      }
    }
  }
}

{
  // D3: src/store/* must not import from src/hooks or src/app.
  for (const f of walk(join(SRC, "store"))) {
    if (!f.endsWith(".ts") && !f.endsWith(".tsx")) continue;
    const src = read(f);
    if (!src) continue;
    for (const banned of ["@/hooks/", "@/app/"]) {
      if (src.includes(`from "${banned}`) || src.includes(`from '${banned}`)) {
        recordError(f, `store must not import from ${banned}`);
      }
    }
  }
}

{
  // D4: middleware.ts pass-through must not be a half-stub (it must be empty
  //     or have real logic; flag if it has only `import` and `export const
  //     config = {}`).
  if (existsSync(MIDDLEWARE)) {
    const src = read(MIDDLEWARE);
    if (src) {
      const hasNextResponseNext = src.includes("NextResponse.next()");
      const hasMatcher = src.includes("matcher");
      const hasLogic = src.split("\n").length > 25; // arbitrary threshold
      if (hasNextResponseNext && hasMatcher && !hasLogic) {
        recordWarning(
          MIDDLEWARE,
          "middleware.ts is a pass-through with matcher but no real logic — consider removing it"
        );
      }
    }
  }
}

// ============================================================================
// E. Security patterns
// ============================================================================
{
  // E1: no hardcoded secrets. We look for **values** assigned to identifiers
  //     that look like secrets, not path segments containing words like
  //     "password" (e.g. `/auth/forgot-password`).
  //
  //     Pattern: identifier containing password/secret/api_key/token/etc.
  //     assigned (with = or :) to a string literal of length >= 8.
  const ALLOWLIST_SECRETS = new Set([
    // The string "ACCESS_TOKEN_EXPIRED" etc. is an error code, not a secret.
    "src/lib/api/auth-error-codes.ts",
  ]);
  // Match: `somePassword: "..."` or `SOME_SECRET = "..."` or `api_key="..."`
  // Exclude: paths/URLs (contain `/` and start with `/` or `http`)
  const SECRET_PATTERN = /\b([a-zA-Z_$][\w$]*(?:password|secret|api_?key|token))\s*[:=]\s*["'`]([^"'`\s/][^"'`\s]{7,})["'`]/i;

  for (const f of srcFiles()) {
    if (f.includes(".test.") || f.includes(".spec.")) continue;
    const rel = relative(ROOT, f);
    if (ALLOWLIST_SECRETS.has(rel)) continue;
    const src = read(f);
    if (!src) continue;
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (SECRET_PATTERN.test(line)) {
        const trimmed = line.trim();
        if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
        recordError(f, `possible hardcoded secret on line ${i + 1}: ${trimmed.slice(0, 80)}`);
      }
    }
  }
}

{
  // E2: no eval, new Function, setTimeout(string).
  for (const f of srcFiles()) {
    const src = read(f);
    if (!src) continue;
    for (const pattern of [/\beval\s*\(/, /\bnew\s+Function\s*\(/, /setTimeout\s*\(\s*["'`]/]) {
      if (pattern.test(src)) {
        recordError(f, `forbidden pattern: ${pattern}`);
      }
    }
  }
}

{
  // E3: no dangerouslySetInnerHTML outside shadcn-generated files.
  const SHADCN_FILES = new Set([]); // update if shadcn components live here
  for (const f of srcFiles()) {
    if (SHADCN_FILES.has(relative(ROOT, f))) continue;
    const src = read(f);
    if (!src) continue;
    if (src.includes("dangerouslySetInnerHTML")) {
      recordWarning(f, `uses dangerouslySetInnerHTML — verify this is intentional`);
    }
  }
}

{
  // E4: no `.innerHTML =` assignment (XSS vector).
  for (const f of srcFiles()) {
    const src = read(f);
    if (!src) continue;
    if (/\.innerHTML\s*=/.test(src)) {
      recordError(f, `direct .innerHTML assignment is a XSS vector`);
    }
  }
}

// ============================================================================
// F. Dead code detection
// ============================================================================
{
  // F1: exports in index.ts barrel files that are not imported elsewhere.
  function findImports(file, name) {
    let count = 0;
    for (const other of srcFiles()) {
      if (other === file) continue;
      const src = read(other);
      if (!src) continue;
      const re = new RegExp(`\\b${name}\\b`);
      if (re.test(src)) count++;
    }
    return count;
  }

  for (const f of walk(SRC, [".ts", ".tsx"]).filter((x) =>
    basename(x).startsWith("index.")
  )) {
    const src = read(f);
    if (!src) continue;
    // Match `export { X, Y, Z }` and `export const X = ...` and `export type X = ...`
    const namedExports = [...src.matchAll(/export\s*\{\s*([^}]+)\s*\}/g)].flatMap(
      (m) =>
        m[1]
          .split(",")
          .map((s) => s.trim().split(/\s+as\s+/)[0])
          .filter(Boolean)
    );
    const declExports = [
      ...src.matchAll(/export\s+(?:const|function|class|interface|type)\s+([A-Za-z_$][\w$]*)/g),
    ].map((m) => m[1]);

    for (const name of [...namedExports, ...declExports]) {
      const imports = findImports(f, name);
      // Imports inside the barrel itself (the `export {...}` line) do not count.
      // findImports already excludes the file itself.
      if (imports === 0) {
        recordWarning(f, `export "${name}" has no imports anywhere (potential dead code)`);
      }
    }
  }
}

{
  // F2: orphan source files (never imported).
  // Skip: entry points, route files, page/layout/loading/error, and files that
  //       export default.
  function isLikelyEntry(f) {
    const name = basename(f);
    if (name === "page.tsx" || name === "layout.tsx" || name === "loading.tsx" ||
        name === "error.tsx" || name === "not-found.tsx" || name === "route.ts" ||
        name === "global-error.tsx" || name === "middleware.ts") return true;
    return false;
  }
  function isOrphan(f, allFiles) {
    const base = basename(f).replace(extname(f), "");
    // Strip suffix for store/api names like use-login, auth-store
    for (const other of allFiles) {
      if (other === f) continue;
      const src = read(other);
      if (!src) continue;
      // Direct import: `from "./foo"` or `from "@/.../foo"`
      const importRe = new RegExp(
        `from\\s+["'\`][^"'\`]*[/\\.]${base}["'\`]`
      );
      if (importRe.test(src)) return false;
      // Side-effect or namespace import
      const sideEffectRe = new RegExp(`import\\s+["'\`][^"'\`]*${base}["'\`]`);
      if (sideEffectRe.test(src)) return false;
    }
    return true;
  }
  const allSrc = srcFiles();
  for (const f of allSrc) {
    if (isLikelyEntry(f)) continue;
    if (basename(f).startsWith("index.")) continue;
    if (f.includes(".test.") || f.includes(".spec.")) continue;
    const src = read(f);
    if (!src) continue;
    // skip files with default export (typically pages, components)
    if (/export\s+default\s/.test(src)) continue;
    if (isOrphan(f, allSrc)) {
      recordWarning(f, `file is not imported anywhere (potential dead code)`);
    }
  }
}

// ============================================================================
// G. Test coverage minimum
// ============================================================================
{
  // G1: at least one test file exists.
  const testFiles = walk(ROOT).filter(
    (f) =>
      f.includes(".test.") ||
      f.includes(".spec.") ||
      f.includes("__tests__" + sep)
  );
  if (testFiles.length === 0) {
    warnings.push("no test files found in repo (consider adding at least one)");
  }
}

{
  // G2: test script in package.json is not empty.
  if (existsSync(PACKAGE)) {
    const pkg = JSON.parse(read(PACKAGE));
    if (pkg.scripts?.test && !pkg.scripts.test.trim()) {
      warnings.push('package.json: "test" script is empty');
    }
  }
}

// ============================================================================
// C4 (env example coverage of NEXT_PUBLIC_*)
// ============================================================================
{
  const envSrc = read(ENV_EXAMPLE);
  if (!envSrc) {
    warnings.push(".env.example not found");
  } else {
    // Verify all NEXT_PUBLIC_* env vars in .env.example have a comment or
    // blank line describing them.
    const lines = envSrc.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^NEXT_PUBLIC_[A-Z_][A-Z0-9_]*=/);
      if (m && i > 0) {
        // Check if previous non-blank line is a comment.
        for (let j = i - 1; j >= 0; j--) {
          const prev = lines[j].trim();
          if (prev === "") continue;
          if (prev.startsWith("#")) break;
          warnings.push(
            `.env.example line ${i + 1}: NEXT_PUBLIC_* should have a comment above it`
          );
          break;
        }
      }
    }
  }
}

// ============================================================================
// Output
// ============================================================================
for (const w of warnings) console.warn(`⚠  ${w}`);
for (const e of errors) console.error(`✖  ${e}`);

const total = errors.length + warnings.length;
console.log(
  `\nverify:audit: ${errors.length} error(s), ${warnings.length} warning(s), ${total} total`
);

if (errors.length > 0) {
  console.error("verify:audit FAILED — fix the errors above.");
  process.exit(1);
}
console.log("verify:audit OK.");

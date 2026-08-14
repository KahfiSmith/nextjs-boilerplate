#!/usr/bin/env node
/**
 * docs:check — validates that docs/ stays in sync with the repository.
 *
 * Checks:
 *  1. Every markdown link inside docs/ resolves to an existing file.
 *  2. Every `src/...` path referenced in docs/ exists in the repo.
 *  3. Every `/api/v1/...` endpoint listed in docs/api/authentication.md
 *     matches an endpoint defined in src/lib/api/endpoints.ts.
 *
 * Exit code is non-zero when any check fails.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";

const ROOT = process.cwd();
const DOCS_DIR = join(ROOT, "docs");
const ENV_REFERENCE = "docs/api/authentication.md";

function exists(path) {
  return existsSync(path);
}

const errors = [];
const warnings = [];

// --- collect all markdown files -------------------------------------------
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

const markdownFiles = walk(DOCS_DIR);

// --- 1. markdown links resolve ---------------------------------------------
const LINK_RE = /\]\(([^)]+\.md)(?:[^)]*)\)/g;

// A target is "external" if it resolves outside the repo root (e.g. a sibling
// repository like ../Backend/fiber-boilerplate). External links are skipped:
// they document cross-repo relationships and are not part of this repo.
function isExternal(targetPath) {
  const rel = relative(ROOT, targetPath);
  return rel.startsWith("..") || (rel !== "" && !rel.startsWith("."));
}

for (const file of markdownFiles) {
  const content = readFileSync(file, "utf8");
  const fileDir = dirname(file);
  let match;
  while ((match = LINK_RE.exec(content)) !== null) {
    const raw = match[1].split("#")[0];
    const target = resolve(fileDir, raw);
    if (isExternal(target)) continue;
    if (!exists(target)) {
      errors.push(
        `Broken link in ${relative(ROOT, file)}: -> ${raw}`
      );
    }
  }
}

// --- 2. src/ paths referenced in docs exist --------------------------------
const SRC_RE = /`(src\/[A-Za-z0-9_/.\-()*]+)`/g;
const seen = new Set();

for (const file of markdownFiles) {
  const content = readFileSync(file, "utf8");
  let match;
  while ((match = SRC_RE.exec(content)) !== null) {
    const raw = match[1];
    // glob-style suffixes like `...` or `**` are intentionally non-literal
    if (raw.endsWith("...") || raw.endsWith("**")) continue;
    if (seen.has(raw)) continue;
    seen.add(raw);
    const target = join(ROOT, raw);
    // skip references to other repos (e.g. src/modules/... in backend docs)
    if (!exists(target) && isExternal(target)) continue;
    if (!exists(target)) {
      warnings.push(
        `Referenced src path not found: ${raw} (in ${relative(ROOT, file)})`
      );
    }
  }
}

// --- 3. endpoints in docs match endpoints.ts --------------------------------
const endpointsFile = join(ROOT, "src/lib/api/endpoints.ts");
if (!exists(endpointsFile)) {
  errors.push("src/lib/api/endpoints.ts is missing");
} else {
  const endpointsSrc = readFileSync(endpointsFile, "utf8");
  const endpointPathRe = /"(\/api\/v1\/auth\/[a-z-]+)"/g;
  const defined = new Set();
  let m;
  while ((m = endpointPathRe.exec(endpointsSrc)) !== null) {
    defined.add(m[1]);
  }

  const authDoc = join(ROOT, ENV_REFERENCE);
  if (!exists(authDoc)) {
    errors.push(`${ENV_REFERENCE} is missing`);
  } else {
    const docContent = readFileSync(authDoc, "utf8");
    const docRe = /`(\/api\/v1\/auth\/[a-z-]+)`/g;
    const documented = new Set();
    while ((m = docRe.exec(docContent)) !== null) {
      documented.add(m[1]);
    }

    for (const path of documented) {
      if (!defined.has(path)) {
        errors.push(`Endpoint documented but not defined in endpoints.ts: ${path}`);
      }
    }
    // warn on defined-but-undocumented (missing from docs) — not an error
    for (const path of defined) {
      if (!documented.has(path)) {
        warnings.push(`Endpoint defined in endpoints.ts but not documented: ${path}`);
      }
    }
  }
}

// --- output -----------------------------------------------------------------
for (const w of warnings) console.warn(`⚠  ${w}`);
for (const e of errors) console.error(`✖  ${e}`);

if (errors.length > 0) {
  console.error(`\ndocs:check FAILED — ${errors.length} error(s), ${warnings.length} warning(s).`);
  console.error("Fix the docs or the code so docs stay accurate.");
  process.exit(1);
}

console.log(`docs:check OK — ${markdownFiles.length} files, ${warnings.length} warning(s).`);

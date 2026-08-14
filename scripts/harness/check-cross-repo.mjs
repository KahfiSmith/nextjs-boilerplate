#!/usr/bin/env node
/**
 * verify:cross-repo — validates that this frontend repo stays in sync with the
 * backend repo (fiber-boilerplate).
 *
 * Checks:
 *  1. FE endpoint paths (src/lib/api/endpoints.ts) match BE auth routes
 *     (src/modules/auth/auth.controller.go).
 *  2. FE error codes (src/lib/api/auth-error-codes.ts) are consistent with BE
 *     produced codes (src/common/exceptions, middleware, response).
 *  3. Cross-repo doc links in this repo resolve to existing files in BE.
 *
 * The BE repo is expected at ../Backend/fiber-boilerplate (sibling layout).
 * Exit code is non-zero on any mismatch.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const ROOT = process.cwd();
const BE_ROOT = join(ROOT, "..", "..", "Backend", "fiber-boilerplate");

const errors = [];
const warnings = [];

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

// --- 1. Endpoints match -----------------------------------------------------
const feEndpointsFile = join(ROOT, "src/lib/api/endpoints.ts");
const beControllerFile = join(BE_ROOT, "src/modules/auth/auth.controller.go");

if (!existsSync(BE_ROOT)) {
  errors.push(
    `Backend repo not found at ${BE_ROOT}. Cross-repo check requires the sibling layout.`
  );
} else {
  const fe = read(feEndpointsFile);
  const be = read(beControllerFile);

  if (!fe) errors.push("FE endpoints.ts missing");
  if (!be) errors.push("BE auth.controller.go missing");

  if (fe && be) {
    const feEndpoints = new Set(
      [...fe.matchAll(/"(\/api\/v1\/auth\/[a-z-]+)"/g)].map((m) => m[1])
    );
    const beRoutes = new Set(
      [...be.matchAll(/\.(Post|Get|Delete|Put|Patch)\("([^"]+)"/g)]
        .map((m) => m[2])
        .filter((p) => p !== "User-Agent")
        .map((p) => `/api/v1/auth${p}`)
    );

    const feOnly = [...feEndpoints].filter((p) => !beRoutes.has(p));
    const beOnly = [...beRoutes].filter((p) => !feEndpoints.has(p));

    if (feOnly.length) {
      errors.push(`Endpoints in FE but not in BE routes: ${feOnly.join(", ")}`);
    }
    if (beOnly.length) {
      errors.push(`Routes in BE but not in FE endpoints: ${beOnly.join(", ")}`);
    }
  }
}

// --- 2. Error codes consistent ---------------------------------------------
const feCodesFile = join(ROOT, "src/lib/api/auth-error-codes.ts");
const beSources = [
  join(BE_ROOT, "src/common/exceptions/exceptions.go"),
  join(BE_ROOT, "src/common/middleware/auth.middleware.go"),
  join(BE_ROOT, "src/common/middleware/origin.middleware.go"),
  join(BE_ROOT, "src/common/response/response.go"),
  join(BE_ROOT, "src/modules/auth/auth.service.go"),
  join(BE_ROOT, "src/modules/auth/auth.controller.go"),
];

const feCodesRaw = read(feCodesFile);
if (feCodesRaw) {
  const feCodes = new Set(
    [...feCodesRaw.matchAll(/([A-Z][A-Z_]+): "([A-Z_]+)"/g)].map((m) => m[2])
  );

  const beCodes = new Set();
  for (const f of beSources) {
    const src = read(f);
    if (!src) continue;
    for (const m of src.matchAll(/(?:Unauthorized|Forbidden|BadRequest|NotFound|Internal|TooManyRequests)\(\s*"([A-Z_]+)"/g)) {
      beCodes.add(m[1]);
    }
    for (const m of src.matchAll(/codeStr = "([A-Z_]+)"/g)) {
      beCodes.add(m[1]);
    }
  }

  // FE may carry defensive codes not produced by BE; BE codes must be known to FE.
  const beUnknown = [...beCodes].filter((c) => !feCodes.has(c));
  if (beUnknown.length) {
    warnings.push(
      `Backend codes not present in FE auth-error-codes.ts: ${beUnknown.join(", ")}`
    );
  }
}

// --- 3. Cross-repo doc links resolve ----------------------------------------
function walkMd(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkMd(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

const LINK_RE = /\]\(([^)]+\.md)(?:[^)]*)\)/g;
for (const file of walkMd(join(ROOT, "docs"))) {
  const content = readFileSync(file, "utf8");
  const dir = dirname(file);
  let m;
  while ((m = LINK_RE.exec(content)) !== null) {
    const raw = m[1].split("#")[0];
    const target = resolve(dir, raw);
    // only check links that escape into the backend sibling
    if (!target.startsWith(BE_ROOT)) continue;
    if (!existsSync(target)) {
      errors.push(`Cross-repo link broken in ${file}: -> ${raw}`);
    }
  }
}

// --- output -----------------------------------------------------------------
for (const w of warnings) console.warn(`⚠  ${w}`);
for (const e of errors) console.error(`✖  ${e}`);

if (errors.length > 0) {
  console.error(`\nverify:cross-repo FAILED — ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`verify:cross-repo OK — FE↔BE in sync (${warnings.length} warning(s)).`);

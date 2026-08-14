#!/usr/bin/env node
/**
 * verify:risk — classify a change by path heuristics.
 *
 * Usage:
 *   node scripts/harness/check-risk.mjs            # compares HEAD..worktree
 *   node scripts/harness/check-risk.mjs --base <rev> --head <rev>
 *
 * Prints the maximum risk level across all changed paths:
 *   low | medium | high
 *
 * Exit code is 0 always (informational); CI/docs use the printed level.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

// Parse --base/--head
const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base");
const headIdx = args.indexOf("--head");
const base = baseIdx !== -1 ? args[baseIdx + 1] : "HEAD";
const head = headIdx !== -1 ? args[headIdx + 1] : null;

function gitChangedPaths() {
  const baseRev = head ? `${base}...${head}` : base;
  try {
    // Committed changes + worktree/untracked
    const committed = execSync(`git diff --name-only ${baseRev}`, {
      encoding: "utf8",
      cwd: ROOT,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const staged = execSync(`git diff --cached --name-only`, {
      encoding: "utf8",
      cwd: ROOT,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const untracked = execSync(`git ls-files --others --exclude-standard`, {
      encoding: "utf8",
      cwd: ROOT,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const set = new Set(
      [committed, staged, untracked]
        .filter(Boolean)
        .flatMap((s) => s.split("\n"))
        .filter(Boolean)
    );
    return [...set];
  } catch {
    return [];
  }
}

// Risk rules: highest match wins.
// Order matters — first matching rule with the highest severity is used.
const RULES = [
  { risk: "high", test: (p) => /^src\/(lib\/api|store|config)\//.test(p) },
  { risk: "high", test: (p) => /^src\/hooks\/auth\//.test(p) },
  { risk: "high", test: (p) => p === "middleware.ts" },
  { risk: "high", test: (p) => /^(package\.json|pnpm-lock\.yaml|next\.config\.ts|tsconfig\.json|components\.json)/.test(p) },
  { risk: "high", test: (p) => /^scripts\/harness\//.test(p) },
  { risk: "high", test: (p) => /^\.github\//.test(p) },
  { risk: "high", test: (p) => /\.githooks\//.test(p) },
  { risk: "medium", test: (p) => /^src\/(app|components|providers|hooks|types|lib\/(schemas|utils))\//.test(p) },
  { risk: "medium", test: (p) => /^src\/.*\.test\.(ts|tsx)$/.test(p) },
  { risk: "medium", test: (p) => /^scripts\//.test(p) },
  { risk: "low", test: (p) => /^(docs\/|.*\.md$|\.env\.example|\.gitignore)/.test(p) },
];

function classify(path) {
  for (const rule of RULES) {
    if (rule.test(path)) return rule.risk;
  }
  return "medium"; // unknown paths default to medium
}

const paths = gitChangedPaths();
let maxRisk = "low";
const riskOrder = { low: 0, medium: 1, high: 2 };

for (const p of paths) {
  const r = classify(p);
  if (riskOrder[r] > riskOrder[maxRisk]) maxRisk = r;
}

console.log(`risk: ${maxRisk}`);
if (paths.length > 0) {
  console.log(`changed: ${paths.length} path(s)`);
  for (const p of paths) console.log(`  [${classify(p)}] ${p}`);
} else {
  console.log("changed: none (clean or single-commit)");
}

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const localSiblingPath = resolve(process.cwd(), "../../Backend/fiber-boilerplate/docs/openapi/openapi.yaml");
const localRepoPath = resolve(process.cwd(), "docs/openapi/openapi.yaml");

let source = process.env.OPENAPI_SOURCE;

if (!source) {
  if (existsSync(localSiblingPath)) {
    source = localSiblingPath;
  } else if (existsSync(localRepoPath)) {
    source = localRepoPath;
  } else {
    source = process.env.NEXT_PUBLIC_BACKEND_API_URL 
      ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/openapi.yaml` 
      : "http://localhost:8080/openapi.yaml";
  }
}

console.log(`[api:generate] Generating types using source: ${source}`);

try {
  execSync(`npx openapi-typescript "${source}" -o src/lib/api/generated/schema.ts`, {
    stdio: "inherit",
  });
  console.log(`[api:generate] Schema generated successfully at src/lib/api/generated/schema.ts`);
} catch (err) {
  console.error(`[api:generate] Failed to generate types from ${source}.`);
  console.error("Tip: Set OPENAPI_SOURCE=<url|path> or start the backend dev server.");
  process.exit(1);
}

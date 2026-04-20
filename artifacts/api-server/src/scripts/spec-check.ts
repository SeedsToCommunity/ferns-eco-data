import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const ROUTES_DIR = path.resolve(__dirname, "..", "routes");
const SPEC_PATH = path.resolve(REPO_ROOT, "lib", "api-spec", "openapi.yaml");

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Parser assumptions:
// - Route paths must be string literals passed directly to router.get/post/etc.
//   Non-literal expressions (e.g. router.get(PATH_CONST, ...)) are not detected.
// - Only scans top-level src/routes/*.ts files; nested route subdirectories
//   would need to be added to extractRoutePaths if the routing structure changes.
// - Only GET routes are checked — admin POST endpoints are intentionally excluded from the spec.

// Routes that exist in code but are intentionally absent from the spec.
// The spec-serving routes document the spec itself — circular to document.
const INTENTIONAL_OMISSIONS = new Set(["/openapi.yaml", "/openapi.json"]);

function expressToOpenApi(path: string): string {
  return path.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, "{$1}");
}

function extractRoutePaths(dir: string): Map<string, string[]> {
  const routePattern = /router\.(get|post|put|patch|delete)\(\s*["'`]([^"'`]+)["'`]/g;
  const results = new Map<string, string[]>();

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts");

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), "utf-8");
    const paths: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = routePattern.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      if (method === "GET") {
        paths.push(expressToOpenApi(routePath));
      }
    }
    if (paths.length > 0) {
      results.set(file, paths);
    }
  }

  return results;
}

function extractSpecPaths(specPath: string): Set<string> {
  const content = fs.readFileSync(specPath, "utf-8");
  const spec = yaml.load(content) as { paths?: Record<string, unknown> };
  if (!spec.paths) return new Set();
  return new Set(Object.keys(spec.paths));
}

function run(): void {
  const routesByFile = extractRoutePaths(ROUTES_DIR);
  const allRoutePaths = new Set<string>();
  for (const paths of routesByFile.values()) {
    for (const p of paths) allRoutePaths.add(p);
  }

  const specPaths = extractSpecPaths(SPEC_PATH);

  const missingFromSpec: string[] = [];
  for (const routePath of allRoutePaths) {
    if (!INTENTIONAL_OMISSIONS.has(routePath) && !specPaths.has(routePath)) {
      missingFromSpec.push(routePath);
    }
  }

  const missingFromCode: string[] = [];
  for (const specPath of specPaths) {
    if (!allRoutePaths.has(specPath)) {
      missingFromCode.push(specPath);
    }
  }

  missingFromSpec.sort();
  missingFromCode.sort();

  let hasError = false;

  if (missingFromSpec.length > 0) {
    hasError = true;
    console.error(
      `\n${RED}✗ ${missingFromSpec.length} GET route(s) in code are missing from the OpenAPI spec:${RESET}`
    );
    for (const p of missingFromSpec) {
      console.error(`  ${YELLOW}${p}${RESET}`);
    }
    console.error(
      `\n  Add these paths to lib/api-spec/openapi.yaml, then re-run spec:check.\n`
    );
  }

  if (missingFromCode.length > 0) {
    hasError = true;
    console.error(
      `\n${RED}✗ ${missingFromCode.length} path(s) in the OpenAPI spec have no matching GET route in code:${RESET}`
    );
    for (const p of missingFromCode) {
      console.error(`  ${YELLOW}${p}${RESET}`);
    }
    console.error(
      `\n  Either add the missing routes in artifacts/api-server/src/routes/, or remove the stale paths from the spec.\n`
    );
  }

  if (!hasError) {
    const total = allRoutePaths.size - INTENTIONAL_OMISSIONS.size;
    console.log(
      `\n${GREEN}✓ No drift. ${total} documented GET route(s) match the spec.${RESET}\n`
    );
    process.exit(0);
  } else {
    process.exit(1);
  }
}

run();

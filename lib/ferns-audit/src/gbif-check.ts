/**
 * Standalone GBIF integration check runner.
 *
 * Exercises all six GBIF adapter routes against a live FERNS server and prints
 * a pass/fail summary to stdout. Exits 0 on success, 1 if any check fails.
 *
 * Usage:
 *   pnpm --filter @workspace/ferns-audit run gbif-check
 *   FERNS_API_BASE_URL=http://localhost:8080 pnpm --filter @workspace/ferns-audit run gbif-check
 */

import { runGbifIntegrationChecks } from "./checks/gbif.js";
import type { EndpointComparison } from "./types.js";

const DEFAULT_FERNS_BASE = process.env["REPLIT_DEV_DOMAIN"]
  ? `https://${process.env["REPLIT_DEV_DOMAIN"]}`
  : "http://localhost:8080";

function printResult(c: EndpointComparison): void {
  const icon = c.ok ? "✓" : "✗";
  const status = c.ok ? "PASS" : "FAIL";
  process.stdout.write(`  ${icon} [${status}] ${c.label}\n`);
  if (!c.ok && c.error) {
    process.stdout.write(`       error: ${c.error}\n`);
  }
  for (const f of c.findings) {
    if (f.type === "gap" || f.type === "mismatch") {
      process.stdout.write(`       ${f.type.toUpperCase()}: ${f.note ?? f.sourceField}\n`);
    }
  }
}

async function waitForServer(url: string, maxWaitMs = 60_000): Promise<void> {
  const healthUrl = `${url}/api/healthz`;
  const deadline = Date.now() + maxWaitMs;
  let attempt = 0;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(healthUrl);
      if (res.ok) return;
    } catch {
      // server not ready yet
    }
    attempt++;
    const delay = Math.min(2000, 500 * attempt);
    process.stdout.write(`  Waiting for server (attempt ${attempt})...\n`);
    await new Promise((r) => setTimeout(r, delay));
  }
  throw new Error(`Server at ${url} did not become ready within ${maxWaitMs}ms`);
}

async function main(): Promise<void> {
  const fernsBase = (
    process.env["FERNS_API_BASE_URL"] ??
    process.env["FERNS_BASE_URL"] ??
    DEFAULT_FERNS_BASE
  ).replace(/\/$/, "");

  process.stdout.write(`\nGBIF Integration Check\n`);
  process.stdout.write(`Target: ${fernsBase}\n\n`);

  process.stdout.write(`Waiting for server to be ready...\n`);
  try {
    await waitForServer(fernsBase);
  } catch (err) {
    process.stdout.write(`FATAL: ${String(err)}\n`);
    process.exit(1);
  }
  process.stdout.write(`Server ready.\n\n`);

  let checks: EndpointComparison[];
  try {
    checks = await runGbifIntegrationChecks(fernsBase);
  } catch (err) {
    process.stdout.write(`FATAL: ${String(err)}\n`);
    process.exit(1);
  }

  const passed = checks.filter((c) => c.ok);
  const failed = checks.filter((c) => !c.ok);

  for (const route of [
    "species/match",
    "species/search",
    "species/:usageKey",
    "synonyms",
    "vernacularNames",
    "occurrence/search",
  ]) {
    const group = checks.filter((c) => c.label.toLowerCase().includes(route.toLowerCase().replace("/:", " ")));
    if (group.length) {
      process.stdout.write(`${route}\n`);
      group.forEach(printResult);
      process.stdout.write("\n");
    }
  }

  const ungrouped = checks.filter(
    (c) =>
      !["species/match", "species/search", "species/:usageKey", "synonyms", "vernacularNames", "occurrence/search"].some((r) =>
        c.label.toLowerCase().includes(r.toLowerCase().replace("/:", " ")),
      ),
  );
  if (ungrouped.length) {
    process.stdout.write("other\n");
    ungrouped.forEach(printResult);
    process.stdout.write("\n");
  }

  process.stdout.write(`─────────────────────────────────────────\n`);
  process.stdout.write(`Result: ${passed.length} passed, ${failed.length} failed (${checks.length} total)\n\n`);

  if (failed.length > 0) {
    process.stdout.write(`Failed checks:\n`);
    for (const c of failed) {
      process.stdout.write(`  • ${c.label}${c.error ? `: ${c.error}` : ""}\n`);
    }
    process.stdout.write("\n");
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${String(err)}\n`);
  process.exit(1);
});

import { TEST_SPECIES, TEST_PLACES } from "./corpus.js";
import { runGbifComparators } from "./comparators/gbif.js";
import { runInatComparators } from "./comparators/inat.js";
import { runBonapComparators } from "./comparators/bonap.js";
import { checkApiDocs, checkRegistry } from "./checks/docs.js";
import { checkUrls } from "./checks/urls.js";
import { printReport, printReportJson } from "./report.js";
import type { AuditReport, UrlEntry } from "./types.js";

const DEFAULT_FERNS_BASE = process.env["REPLIT_DEV_DOMAIN"]
  ? `https://${process.env["REPLIT_DEV_DOMAIN"]}`
  : "http://localhost:3000";

async function main(): Promise<void> {
  const fernsBase = (process.env["FERNS_BASE_URL"] ?? DEFAULT_FERNS_BASE).replace(/\/$/, "");
  const outputJson = process.argv.includes("--json");

  process.stderr.write(`\nFERNS Audit Tool\n`);
  process.stderr.write(`Target: ${fernsBase}\n`);
  process.stderr.write(`Species: ${TEST_SPECIES.map((s) => s.name).join(", ")}\n`);
  process.stderr.write(`Places : ${TEST_PLACES.map((p) => `${p.name} (${p.id})`).join(", ")}\n\n`);

  process.stderr.write("Checking API documentation...\n");
  const docChecks = await checkApiDocs(fernsBase);

  process.stderr.write("Checking source registry...\n");
  const registryCheck = await checkRegistry(fernsBase);

  process.stderr.write("Running GBIF comparators...\n");
  const gbifComparisons = await runGbifComparators(fernsBase, TEST_SPECIES);

  process.stderr.write("Running iNaturalist comparators...\n");
  const inatComparisons = await runInatComparators(fernsBase, TEST_SPECIES, TEST_PLACES);

  process.stderr.write("Running BONAP comparators...\n");
  const bonapComparisons = await runBonapComparators(fernsBase, TEST_SPECIES);

  const allComparisons = [...gbifComparisons, ...inatComparisons, ...bonapComparisons];

  const allUrls: UrlEntry[] = allComparisons.flatMap((c) => c.urlsCollected);

  process.stderr.write(`Checking ${allUrls.length} collected URLs...\n`);
  const urlChecks = await checkUrls(allUrls, fernsBase);

  const report: AuditReport = {
    generatedAt: new Date().toISOString(),
    fernsBaseUrl: fernsBase,
    docChecks,
    registryCheck,
    comparisons: allComparisons,
    urlChecks,
  };

  process.stderr.write("Generating report...\n\n");

  if (outputJson) {
    printReportJson(report);
  } else {
    printReport(report);
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${String(err)}\n`);
  process.exit(1);
});

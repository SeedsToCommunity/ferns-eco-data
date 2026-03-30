// AUDIT TOOL RULES:
// - This tool must NEVER run autonomously or on a schedule.
// - Audit output is for human review only — no code or data changes are made based on audit results.
// - The user decides what (if anything) to fix after reviewing the audit report.
// - Do not attempt to auto-correct, normalize, or silently hide source data based on findings.

import { TEST_SPECIES, TEST_PLACES } from "./corpus.js";
import { runGbifComparators } from "./comparators/gbif.js";
import { runInatComparators } from "./comparators/inat.js";
import { runBonapComparators } from "./comparators/bonap.js";
import { runMifloraComparators } from "./comparators/miflora.js";
import { runUniversalFqaComparators } from "./comparators/universal-fqa.js";
import { runCoefficientChecks, runWetlandIndicatorChecks, runWucolsChecks, runS2CChecks } from "./checks/static-sources.js";
import { checkApiDocs, checkRegistry } from "./checks/docs.js";
import { checkUrls } from "./checks/urls.js";
import { printReport, printReportJson } from "./report.js";
import type { AuditReport, UrlEntry } from "./types.js";

const DEFAULT_FERNS_BASE = process.env["REPLIT_DEV_DOMAIN"]
  ? `https://${process.env["REPLIT_DEV_DOMAIN"]}`
  : "http://localhost:8080";

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

  process.stderr.write("Running Michigan Flora comparators...\n");
  const mifloraComparisons = await runMifloraComparators(fernsBase, TEST_SPECIES);

  process.stderr.write("Running Universal FQA comparators...\n");
  const ufqaComparisons = await runUniversalFqaComparators(fernsBase, TEST_SPECIES);

  process.stderr.write("Running static source health checks (Coefficient, Wetland Indicator, WUCOLS, S2C)...\n");
  const [coeffChecks, wetlandChecks, wucolsChecks, s2cChecks] = await Promise.all([
    runCoefficientChecks(fernsBase),
    runWetlandIndicatorChecks(fernsBase),
    runWucolsChecks(fernsBase),
    runS2CChecks(fernsBase),
  ]);

  const allComparisons = [
    ...gbifComparisons,
    ...inatComparisons,
    ...bonapComparisons,
    ...mifloraComparisons,
    ...ufqaComparisons,
    ...coeffChecks,
    ...wetlandChecks,
    ...wucolsChecks,
    ...s2cChecks,
  ];

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

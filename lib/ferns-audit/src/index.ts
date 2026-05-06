// AUDIT TOOL RULES:
// - This tool must NEVER run autonomously or on a schedule.
// - Audit output is for human review only — no code or data changes are made based on audit results.
// - The user decides what (if anything) to fix after reviewing the audit report.
// - Do not attempt to auto-correct, normalize, or silently hide source data based on findings.

import {
  TEST_SPECIES,
  TEST_PLACES,
  TEST_PLACE_QUERIES,
  TEST_GBIF_SEARCHES,
  TEST_COEFFICIENT_VALUES,
  TEST_WETLAND_CODES,
  TEST_WETLAND_W_VALUES,
  TEST_WUCOLS_CODES,
  TEST_S2C_YEARS,
  TEST_UFQA_ASSESSMENTS,
} from "./corpus.js";
import { runGbifComparators } from "./comparators/gbif.js";
import { runInatComparators } from "./comparators/inat.js";
import { runBonapComparators } from "./comparators/bonap.js";
import { runMifloraComparators } from "./comparators/miflora.js";
import { runUniversalFqaComparators } from "./comparators/universal-fqa.js";
import { runUsdaPlantsComparators } from "./comparators/usda-plants.js";
import { runCoefficientChecks, runWetlandIndicatorChecks, runWucolsChecks, runS2CChecks, runLcscgChecks, runMnfiChecks, runNatureserveChecks, runBotanicalRefTextChecks, runLbjChecks } from "./checks/static-sources.js";
import { checkApiDocs, checkRegistry } from "./checks/docs.js";
import { checkUrls } from "./checks/urls.js";
import { printReport, printReportJson } from "./report.js";
import type { AuditReport, UrlEntry } from "./types.js";

const DEFAULT_FERNS_BASE = process.env["REPLIT_DEV_DOMAIN"]
  ? `https://${process.env["REPLIT_DEV_DOMAIN"]}`
  : "http://localhost:8080";

async function main(): Promise<void> {
  const fernsBase = (
    process.env["FERNS_API_BASE_URL"] ??
    process.env["FERNS_BASE_URL"] ??
    DEFAULT_FERNS_BASE
  ).replace(/\/$/, "");
  const outputJson = process.argv.includes("--json");

  process.stderr.write(`\nFERNS Audit Tool\n`);
  process.stderr.write(`Target: ${fernsBase}\n`);
  process.stderr.write(`Species: ${TEST_SPECIES.map((s) => s.name).join(", ")}\n`);
  process.stderr.write(`Places : ${TEST_PLACES.map((p) => `${p.name} (${p.id})`).join(", ")}\n`);
  process.stderr.write(`GBIF searches: ${TEST_GBIF_SEARCHES.map((s) => `"${s.q}"`).join(", ")}\n`);
  process.stderr.write(`S2C years: ${TEST_S2C_YEARS.join(", ")}\n`);
  process.stderr.write(`UFQA assessments: ${TEST_UFQA_ASSESSMENTS.map((a) => `${a.id} (${a.label})`).join(", ")}\n\n`);

  process.stderr.write("Checking API documentation...\n");
  const docChecks = await checkApiDocs(fernsBase);

  process.stderr.write("Checking source registry...\n");
  const registryCheck = await checkRegistry(fernsBase);

  process.stderr.write("Running GBIF comparators (match, reconcile, occurrences, search)...\n");
  const gbifComparisons = await runGbifComparators(fernsBase, TEST_SPECIES, TEST_GBIF_SEARCHES);

  process.stderr.write("Running iNaturalist comparators (place, species, histogram, field-values, observations)...\n");
  const inatComparisons = await runInatComparators(fernsBase, TEST_SPECIES, TEST_PLACES, TEST_PLACE_QUERIES);

  process.stderr.write("Running BONAP comparators...\n");
  const bonapComparisons = await runBonapComparators(fernsBase, TEST_SPECIES);

  process.stderr.write("Running Michigan Flora comparators...\n");
  const mifloraComparisons = await runMifloraComparators(fernsBase, TEST_SPECIES);

  process.stderr.write("Running Universal FQA comparators (databases, species, assessments)...\n");
  const ufqaComparisons = await runUniversalFqaComparators(fernsBase, TEST_SPECIES, TEST_UFQA_ASSESSMENTS);

  process.stderr.write("Running USDA PLANTS comparators (species lookup via api_fetch)...\n");
  const usdaPlantsComparisons = await runUsdaPlantsComparators(fernsBase, TEST_SPECIES);

  process.stderr.write("Running static source health checks (Coefficient, Wetland Indicator, WUCOLS, S2C, LCSCG, MNFI, NatureServe, BotanicalRefText, LBJ)...\n");
  const [coeffChecks, wetlandChecks, wucolsChecks, s2cChecks, lcscgChecks, mnfiChecks, natureserveChecks, botanicalRefTextChecks, lbjChecks] = await Promise.all([
    runCoefficientChecks(fernsBase, TEST_COEFFICIENT_VALUES),
    runWetlandIndicatorChecks(fernsBase, TEST_WETLAND_CODES, TEST_WETLAND_W_VALUES),
    runWucolsChecks(fernsBase, TEST_WUCOLS_CODES),
    runS2CChecks(fernsBase, TEST_S2C_YEARS),
    runLcscgChecks(fernsBase),
    runMnfiChecks(fernsBase),
    runNatureserveChecks(fernsBase),
    runBotanicalRefTextChecks(fernsBase),
    runLbjChecks(fernsBase),
  ]);

  const allComparisons = [
    ...gbifComparisons,
    ...inatComparisons,
    ...bonapComparisons,
    ...mifloraComparisons,
    ...ufqaComparisons,
    ...usdaPlantsComparisons,
    ...coeffChecks,
    ...wetlandChecks,
    ...wucolsChecks,
    ...s2cChecks,
    ...lcscgChecks,
    ...mnfiChecks,
    ...natureserveChecks,
    ...botanicalRefTextChecks,
    ...lbjChecks,
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

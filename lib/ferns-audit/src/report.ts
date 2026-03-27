import type { AuditReport, EndpointComparison, UrlCheckResult, DocCheckResult } from "./types.js";

const W = 72;
const DIV = "─".repeat(W);
const HEAVY = "═".repeat(W);

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

function ok(v: boolean): string {
  return v ? "✓" : "✗";
}

function truncate(s: string, n: number): string {
  if (typeof s !== "string") return String(s);
  return s.length > n ? s.slice(0, n - 3) + "..." : s;
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "(null)";
  if (typeof v === "string") return truncate(v, 80);
  if (typeof v === "object") return truncate(JSON.stringify(v), 80);
  return String(v);
}

export function printReport(report: AuditReport): void {
  const lines: string[] = [];

  lines.push(HEAVY);
  lines.push("FERNS SOURCE AUDIT REPORT");
  lines.push(`Generated : ${report.generatedAt}`);
  lines.push(`Target    : ${report.fernsBaseUrl}`);
  lines.push(HEAVY);
  lines.push("");

  lines.push(DIV);
  lines.push("API DOCUMENTATION");
  lines.push(DIV);
  for (const check of report.docChecks) {
    const statusStr = check.status !== undefined ? `HTTP ${check.status}` : "no response";
    lines.push(`  ${ok(check.ok)}  ${pad(check.path, 25)}  ${statusStr}${check.error ? `  ERROR: ${check.error}` : ""}`);
  }
  lines.push("");

  lines.push(DIV);
  lines.push("SOURCE REGISTRY");
  lines.push(DIV);
  if (!report.registryCheck.ok) {
    lines.push(`  ✗  Registry fetch failed: ${report.registryCheck.error}`);
  } else {
    for (const src of report.registryCheck.sources) {
      const mCheck = src.metadata_url_check;
      const eCheck = src.explorer_url_check;
      const mStr = mCheck ? `metadata_url: ${ok(mCheck.isAbsolute)} abs  ${ok(mCheck.ok)} ${mCheck.status ?? "err"}` : "metadata_url: n/a";
      const eStr = eCheck ? `explorer_url: ${ok(eCheck.isAbsolute)} abs  ${ok(eCheck.ok)} ${eCheck.status ?? "err"}` : "explorer_url: n/a";
      lines.push(`  ${pad(src.source_id, 18)}  ${mStr}    ${eStr}`);
      if (mCheck?.error) lines.push(`                      metadata error: ${mCheck.error}`);
      if (eCheck?.error) lines.push(`                      explorer error: ${eCheck.error}`);
    }
  }
  lines.push("");

  const bySource = groupBySource(report.comparisons);

  for (const [source, comparisons] of Object.entries(bySource)) {
    lines.push(DIV);
    lines.push(`${source.toUpperCase()} COMPARATOR`);
    lines.push(DIV);

    for (const comp of comparisons) {
      lines.push("");
      lines.push(`  ${comp.label}`);
      lines.push(`  Endpoint: ${comp.endpoint}`);

      if (!comp.ok || comp.error) {
        lines.push(`  ✗  ERROR: ${comp.error ?? "unknown"}`);
        continue;
      }

      const gaps = comp.findings.filter((f) => f.type === "gap");
      const additions = comp.findings.filter((f) => f.type === "addition");
      const nameDiffs = comp.findings.filter((f) => f.type === "name_diff");
      const mismatches = comp.findings.filter((f) => f.type === "mismatch");
      const oks = comp.findings.filter((f) => f.type === "ok");

      if (gaps.length > 0) {
        lines.push("");
        lines.push(`  GAPS — fields in source absent from FERNS data (${gaps.length})`);
        for (const g of gaps) {
          lines.push(`    - ${g.sourceField}: ${formatValue(g.sourceValue)}`);
        }
      }

      if (mismatches.length > 0) {
        lines.push("");
        lines.push(`  MISMATCHES — same field name, different values (${mismatches.length})`);
        for (const m of mismatches) {
          lines.push(`    ~ ${m.sourceField}`);
          lines.push(`        source : ${formatValue(m.sourceValue)}`);
          lines.push(`        ferns  : ${formatValue(m.fernsValue)}`);
          if (m.note) lines.push(`        note   : ${m.note}`);
        }
      }

      if (nameDiffs.length > 0) {
        lines.push("");
        lines.push(`  FIELD NAME DIFFERENCES — same data, different names (${nameDiffs.length})`);
        for (const n of nameDiffs) {
          const valMatch = JSON.stringify(n.sourceValue) === JSON.stringify(n.fernsValue);
          const marker = valMatch ? "~" : "≠";
          lines.push(`    ${marker} ${n.sourceField} → ${n.fernsField}${valMatch ? "" : " (VALUES DIFFER)"}`);
          if (!valMatch) {
            lines.push(`        source : ${formatValue(n.sourceValue)}`);
            lines.push(`        ferns  : ${formatValue(n.fernsValue)}`);
          }
        }
      }

      if (additions.length > 0) {
        const unexpected = additions.filter(
          (a) => a.note && !a.note.includes("expected"),
        );
        const expected = additions.filter(
          (a) => !a.note || a.note.includes("expected"),
        );

        if (unexpected.length > 0) {
          lines.push("");
          lines.push(`  UNEXPECTED ADDITIONS — in FERNS data but not in source (${unexpected.length})`);
          for (const u of unexpected) {
            lines.push(`    + ${u.sourceField}: ${formatValue(u.fernsValue)}`);
            if (u.note) lines.push(`        note: ${u.note}`);
          }
        }

        if (expected.length > 0) {
          lines.push("");
          lines.push(`  FERNS ADDITIONS — expected provenance/cache fields (${expected.length})`);
          for (const e of expected) {
            lines.push(`    + ${e.sourceField} (${e.note})`);
          }
        }
      }

      if (oks.length > 0) {
        lines.push("");
        lines.push(`  NOTES (${oks.length})`);
        for (const o of oks) {
          lines.push(`    ✓ ${o.note ?? o.sourceField}`);
        }
      }
    }

    lines.push("");
  }

  lines.push(DIV);
  lines.push("URL AUDIT");
  lines.push(DIV);
  const failures = report.urlChecks.filter((u) => !u.ok);
  const passes = report.urlChecks.filter((u) => u.ok);
  lines.push(`  Total URLs checked: ${report.urlChecks.length}  ✓ ${passes.length}  ✗ ${failures.length}`);
  if (failures.length > 0) {
    lines.push("");
    lines.push("  FAILURES:");
    for (const f of failures) {
      lines.push(`    ✗ [${f.context}] ${f.field}: ${truncate(f.url, 60)}`);
      if (!f.isAbsolute) lines.push(`        → Not absolute (relative URL)`);
      if (f.status !== undefined) lines.push(`        → HTTP ${f.status}`);
      if (f.error) lines.push(`        → ${f.error}`);
    }
  }
  lines.push("");

  lines.push(DIV);
  lines.push("SUMMARY");
  lines.push(DIV);
  printSummary(lines, report);
  lines.push(HEAVY);

  for (const line of lines) {
    process.stdout.write(line + "\n");
  }
}

function groupBySource(comparisons: EndpointComparison[]): Record<string, EndpointComparison[]> {
  const out: Record<string, EndpointComparison[]> = {};
  for (const c of comparisons) {
    if (!out[c.source]) out[c.source] = [];
    out[c.source].push(c);
  }
  return out;
}

function printSummary(lines: string[], report: AuditReport): void {
  const docFails = report.docChecks.filter((d) => !d.ok).length;
  const urlFails = report.urlChecks.filter((u) => !u.ok).length;

  const allFindings = report.comparisons.flatMap((c) => c.findings);
  const gapCount = allFindings.filter((f) => f.type === "gap").length;
  const mismatchCount = allFindings.filter((f) => f.type === "mismatch").length;
  const nameDiffCount = allFindings.filter((f) => f.type === "name_diff").length;
  const unexpectedAdditionCount = allFindings.filter(
    (f) => f.type === "addition" && f.note && !f.note.includes("expected"),
  ).length;
  const endpointErrors = report.comparisons.filter((c) => !c.ok || c.error).length;

  lines.push(`  API docs failing         : ${docFails}`);
  lines.push(`  Registry/URL failures    : ${urlFails}`);
  lines.push(`  Endpoint errors          : ${endpointErrors}`);
  lines.push(`  Passthrough gaps         : ${gapCount}  (fields dropped by FERNS)`);
  lines.push(`  Field name differences   : ${nameDiffCount}  (camelCase → snake_case renames)`);
  lines.push(`  Value mismatches         : ${mismatchCount}  (same field, different value)`);
  lines.push(`  Unexpected additions     : ${unexpectedAdditionCount}  (FERNS added undocumented fields)`);
  lines.push("");
  lines.push("  This report does not pass or fail. Review findings above and decide what matters.");
}

export function printReportJson(report: AuditReport): void {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
}

function formatUrl(check: UrlCheckResult): string {
  return `${ok(check.ok)} ${check.url}`;
}

void formatUrl;

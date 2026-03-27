import type { AuditReport, EndpointComparison, UrlCheckResult } from "./types.js";

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

interface SourceStats {
  source: string;
  endpoints: number;
  endpointErrors: number;
  gaps: number;
  mismatches: number;
  additionViolations: number;
  envelopeAdditions: number;
  deadUrls: number;
}

function computeSourceStats(
  source: string,
  comparisons: EndpointComparison[],
  urlChecks: UrlCheckResult[],
): SourceStats {
  const mine = comparisons.filter((c) => c.source === source);
  const allFindings = mine.flatMap((c) => c.findings);
  const contextPrefix = source === "gbif" ? "gbif/" : source === "inat" ? "inat/" : "bonap/";
  const myUrls = urlChecks.filter((u) => u.context.startsWith(contextPrefix));

  return {
    source,
    endpoints: mine.length,
    endpointErrors: mine.filter((c) => !c.ok || (c.error && c.findings.length === 0)).length,
    gaps: allFindings.filter((f) => f.type === "gap").length,
    mismatches: allFindings.filter((f) => f.type === "mismatch").length,
    additionViolations: allFindings.filter(
      (f) => f.type === "addition" && f.note && !f.note.includes("Permitted"),
    ).length,
    envelopeAdditions: allFindings.filter(
      (f) => f.type === "addition" && f.note && f.note.includes("Permitted"),
    ).length,
    deadUrls: myUrls.filter((u) => !u.ok && !u.skipped).length,
  };
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
      const mStr = mCheck
        ? `metadata_url: ${ok(mCheck.isAbsolute)} abs  ${ok(mCheck.ok)} ${mCheck.status ?? (mCheck.error ? "err" : "?")}`
        : "metadata_url: n/a";
      const eStr = eCheck
        ? `explorer_url: ${ok(eCheck.isAbsolute)} abs  ${ok(eCheck.ok)} ${eCheck.status ?? (eCheck.error ? "err" : "?")}`
        : "explorer_url: n/a";
      lines.push(`  ${pad(src.source_id, 18)}  ${mStr}    ${eStr}`);
      if (mCheck?.error) lines.push(`                      metadata error: ${mCheck.error}`);
      if (eCheck?.error) lines.push(`                      explorer error: ${eCheck.error}`);
    }
  }
  lines.push("");

  lines.push(DIV);
  lines.push("PER-SOURCE SUMMARY TABLE");
  lines.push(DIV);
  const sources = [...new Set(report.comparisons.map((c) => c.source))];
  const allSourceStats = sources.map((s) =>
    computeSourceStats(s, report.comparisons, report.urlChecks),
  );

  const header = `  ${pad("Source", 10)} ${pad("Endpoints", 10)} ${pad("Gaps", 8)} ${pad("Mismatches", 12)} ${pad("Additions", 12)} ${pad("Dead URLs", 10)}`;
  lines.push(header);
  lines.push("  " + "─".repeat(W - 2));
  for (const s of allSourceStats) {
    lines.push(
      `  ${pad(s.source, 10)} ${pad(String(s.endpoints), 10)} ${pad(String(s.gaps), 8)} ${pad(String(s.mismatches), 12)} ${pad(String(s.additionViolations), 12)} ${pad(String(s.deadUrls), 10)}`,
    );
  }
  lines.push("");

  const bySource = groupBySource(report.comparisons);

  for (const [source, comparisons] of Object.entries(bySource)) {
    lines.push(DIV);
    lines.push(`${source.toUpperCase()} COMPARATOR — DETAIL`);
    lines.push(DIV);

    for (const comp of comparisons) {
      lines.push("");
      lines.push(`  ${comp.label}`);
      lines.push(`  Endpoint: ${comp.endpoint}`);

      if (!comp.ok || (comp.error && comp.findings.length === 0)) {
        lines.push(`  ✗  ERROR: ${comp.error ?? "unknown"}`);
        continue;
      }

      const gaps = comp.findings.filter((f) => f.type === "gap");
      const additions = comp.findings.filter((f) => f.type === "addition");
      const mismatches = comp.findings.filter((f) => f.type === "mismatch");
      const oks = comp.findings.filter((f) => f.type === "ok");

      const violations = additions.filter(
        (a) => a.note && !a.note.includes("Permitted"),
      );
      const envelopeAdditions = additions.filter(
        (a) => a.note && a.note.includes("Permitted"),
      );

      if (gaps.length > 0) {
        lines.push("");
        lines.push(`  GAPS [PASSTHROUGH VIOLATION] — fields in source absent from FERNS data (${gaps.length})`);
        for (const g of gaps) {
          lines.push(`    ✗ ${g.sourceField}: ${formatValue(g.sourceValue)}`);
        }
      }

      if (mismatches.length > 0) {
        lines.push("");
        lines.push(`  VALUE MISMATCHES — same field name, different values (${mismatches.length})`);
        for (const m of mismatches) {
          lines.push(`    ~ ${m.sourceField}`);
          lines.push(`        source : ${formatValue(m.sourceValue)}`);
          lines.push(`        ferns  : ${formatValue(m.fernsValue)}`);
          if (m.note) lines.push(`        note   : ${m.note}`);
        }
      }

      if (violations.length > 0) {
        lines.push("");
        lines.push(`  ADDITIONS [PASSTHROUGH VIOLATION] — in FERNS data but not in source (${violations.length})`);
        for (const v of violations) {
          lines.push(`    ✗ ${v.sourceField}: ${formatValue(v.fernsValue)}`);
          if (v.note) lines.push(`        note: ${v.note}`);
        }
      }

      if (envelopeAdditions.length > 0) {
        lines.push("");
        lines.push(`  FERNS ENVELOPE ADDITIONS — permitted provenance/cache fields (${envelopeAdditions.length})`);
        for (const e of envelopeAdditions) {
          lines.push(`    + ${e.sourceField}`);
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
  const externalVerified = report.urlChecks.filter((u) => u.skipped && u.ok);
  const relativeViolations = report.urlChecks.filter((u) => !u.ok && !u.isAbsolute);
  const fernsReachability = report.urlChecks.filter((u) => u.isAbsolute && !u.skipped);
  const fernsDeadUrls = fernsReachability.filter((u) => !u.ok);
  const totalFails = relativeViolations.length + fernsDeadUrls.length;
  lines.push(
    `  Total URLs: ${report.urlChecks.length}` +
    `  (${externalVerified.length} external-verified, ${fernsReachability.length} FERNS-domain reachability, ${relativeViolations.length} relative)` +
    `  ✗ ${totalFails} fail`,
  );

  if (relativeViolations.length > 0) {
    lines.push("");
    lines.push(`  RELATIVE URL VIOLATIONS — passthrough rule violations (${relativeViolations.length}):`);
    for (const f of relativeViolations) {
      lines.push(`    ✗ [${f.context}] ${f.field}: ${truncate(f.url, 60)}`);
      if (f.allContexts && f.allContexts.length > 1) {
        lines.push(`        → Also appears in: ${f.allContexts.slice(1).join(", ")}`);
      }
      lines.push(`        → Not absolute (relative URL — passthrough violation)`);
    }
  }

  if (fernsDeadUrls.length > 0) {
    lines.push("");
    lines.push(`  FERNS-DOMAIN REACHABILITY FAILURES (${fernsDeadUrls.length}):`);
    for (const f of fernsDeadUrls) {
      lines.push(`    ✗ [${f.context}] ${f.field}: ${truncate(f.url, 60)}`);
      if (f.allContexts && f.allContexts.length > 1) {
        lines.push(`        → Also appears in: ${f.allContexts.slice(1).join(", ")}`);
      }
      if (f.status !== undefined) lines.push(`        → HTTP ${f.status}`);
      if (f.error) lines.push(`        → ${f.error}`);
    }
  }

  if (externalVerified.length > 0) {
    lines.push("");
    lines.push(`  EXTERNAL URLS — verified absolute, reachability not checked (${externalVerified.length}):`);
    for (const e of externalVerified) {
      lines.push(`    ✓ [${e.context}] ${e.field}: ${truncate(e.url, 60)}`);
    }
  }

  lines.push("");

  lines.push(DIV);
  lines.push("OVERALL SUMMARY");
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
  const urlFails = report.urlChecks.filter((u) => !u.ok && !u.skipped).length;

  const allFindings = report.comparisons.flatMap((c) => c.findings);
  const gapCount = allFindings.filter((f) => f.type === "gap").length;
  const mismatchCount = allFindings.filter((f) => f.type === "mismatch").length;
  const additionViolations = allFindings.filter(
    (f) => f.type === "addition" && f.note && !f.note.includes("Permitted"),
  ).length;
  const endpointErrors = report.comparisons.filter((c) => !c.ok || (c.error && c.findings.length === 0)).length;

  lines.push(`  API docs failing             : ${docFails}`);
  lines.push(`  URL failures                 : ${urlFails}`);
  lines.push(`  Endpoint errors              : ${endpointErrors}`);
  lines.push(`  Passthrough gaps             : ${gapCount}  [VIOLATIONS — fields dropped by FERNS]`);
  lines.push(`  Value mismatches             : ${mismatchCount}  [same field name, different value]`);
  lines.push(`  Addition violations          : ${additionViolations}  [FERNS added fields not from source or envelope]`);
  lines.push("");
  lines.push("  This report does not pass or fail. Review violations above and decide what to fix.");
}

export function printReportJson(report: AuditReport): void {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
}

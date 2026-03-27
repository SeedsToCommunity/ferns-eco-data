import { headUrl, isAbsoluteUrl } from "../http.js";
import type { UrlEntry, UrlCheckResult } from "../types.js";

const EXTERNAL_DOMAINS_SKIP_HEAD = [
  "www.gbif.org",
  "gbif.org",
  "www.inaturalist.org",
  "inaturalist.org",
  "www.bonap.org",
  "bonap.org",
  "bonap.net",
  "www.bonap.net",
  "en.wikipedia.org",
];

function isExternalSkipDomain(url: string): boolean {
  try {
    const u = new URL(url);
    return EXTERNAL_DOMAINS_SKIP_HEAD.some(
      (d) => u.hostname === d || u.hostname.endsWith("." + d),
    );
  } catch {
    return false;
  }
}

export async function checkUrls(entries: UrlEntry[]): Promise<UrlCheckResult[]> {
  const unique = deduplicateEntries(entries);
  const results: UrlCheckResult[] = [];

  for (const entry of unique) {
    results.push(await checkUrl(entry));
  }

  return results;
}

function deduplicateEntries(entries: UrlEntry[]): UrlEntry[] {
  const seen = new Set<string>();
  return entries.filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });
}

async function checkUrl(entry: UrlEntry): Promise<UrlCheckResult> {
  const { url, field, context } = entry;

  if (!isAbsoluteUrl(url)) {
    return {
      url,
      field,
      context,
      isAbsolute: false,
      ok: false,
      error: "Relative URL — passthrough URL rule violation",
    };
  }

  if (isExternalSkipDomain(url)) {
    return {
      url,
      field,
      context,
      isAbsolute: true,
      ok: false,
      skipped: true,
      skipReason: "External source website domain — HEAD requests blocked by bot protection. URL is absolute; manual verification required.",
    };
  }

  try {
    const result = await headUrl(url);
    return {
      url,
      field,
      context,
      isAbsolute: true,
      status: result.status,
      ok: result.ok,
    };
  } catch (err) {
    return {
      url,
      field,
      context,
      isAbsolute: true,
      ok: false,
      error: String(err),
    };
  }
}

import { headUrl, isAbsoluteUrl } from "../http.js";
import type { UrlEntry, UrlCheckResult } from "../types.js";

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

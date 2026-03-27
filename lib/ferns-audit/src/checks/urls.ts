import { headUrl, isAbsoluteUrl } from "../http.js";
import type { UrlEntry, UrlCheckResult } from "../types.js";

export async function checkUrls(entries: UrlEntry[]): Promise<UrlCheckResult[]> {
  const { unique, contextMap } = deduplicateEntries(entries);
  const results: UrlCheckResult[] = [];

  for (const entry of unique) {
    const allContexts = contextMap.get(entry.url) ?? [`${entry.context}:${entry.field}`];
    const result = await checkUrl(entry);
    results.push({ ...result, allContexts });
  }

  return results;
}

function deduplicateEntries(entries: UrlEntry[]): {
  unique: UrlEntry[];
  contextMap: Map<string, string[]>;
} {
  const seen = new Map<string, string[]>();
  const unique: UrlEntry[] = [];

  for (const e of entries) {
    const key = e.url;
    const ctx = `${e.context}:${e.field}`;
    if (!seen.has(key)) {
      seen.set(key, [ctx]);
      unique.push(e);
    } else {
      seen.get(key)!.push(ctx);
    }
  }

  return { unique, contextMap: seen };
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

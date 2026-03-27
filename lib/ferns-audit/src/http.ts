const DEFAULT_TIMEOUT_MS = 20000;

export async function fetchJson(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} from ${url}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export interface HeadResult {
  status: number;
  contentType: string | null;
  ok: boolean;
}

export async function headUrl(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<HeadResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    return {
      status: res.status,
      contentType: res.headers.get("content-type"),
      ok: res.ok,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function isAbsoluteUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

export function collectUrls(obj: unknown, context: string): Array<{ url: string; field: string; context: string }> {
  const results: Array<{ url: string; field: string; context: string }> = [];
  if (obj === null || typeof obj !== "object") return results;

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === "string" && (key.endsWith("_url") || key === "source_url" || key === "inat_url") && value.length > 0) {
      results.push({ url: value, field: key, context });
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      results.push(...collectUrls(value, `${context}.${key}`));
    }
  }
  return results;
}

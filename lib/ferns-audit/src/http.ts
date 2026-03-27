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
  } catch (headErr) {
    clearTimeout(timer);
    const controller2 = new AbortController();
    const timer2 = setTimeout(() => controller2.abort(), timeoutMs);
    try {
      const res = await fetch(url, { method: "GET", signal: controller2.signal });
      return {
        status: res.status,
        contentType: res.headers.get("content-type"),
        ok: res.ok,
      };
    } catch (getErr) {
      throw new Error(`HEAD failed (${String(headErr)}); GET also failed: ${String(getErr)}`);
    } finally {
      clearTimeout(timer2);
    }
  } finally {
    clearTimeout(timer);
  }
}

export function isAbsoluteUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

function isUrlFieldName(key: string): boolean {
  const lower = key.toLowerCase();
  return lower === "url" || lower.endsWith("_url") || lower.endsWith("url");
}

export function collectUrls(obj: unknown, context: string): Array<{ url: string; field: string; context: string }> {
  const results: Array<{ url: string; field: string; context: string }> = [];
  collectUrlsInner(obj, context, results);
  return results;
}

function collectUrlsInner(
  obj: unknown,
  context: string,
  results: Array<{ url: string; field: string; context: string }>,
): void {
  if (obj === null || obj === undefined) return;

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => collectUrlsInner(item, `${context}[${i}]`, results));
    return;
  }

  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (typeof value === "string" && isUrlFieldName(key) && value.length > 0) {
        results.push({ url: value, field: key, context });
      } else if (typeof value === "object" && value !== null) {
        collectUrlsInner(value, `${context}.${key}`, results);
      }
    }
    return;
  }
}

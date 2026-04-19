const BASE = (process.env["FERNS_API_BASE"] ?? "http://localhost:8080").replace(/\/$/, "");

export async function fernsGet(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<unknown> {
  const url = new URL(`/api${path}`, BASE);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) {
        url.searchParams.set(k, String(v));
      }
    }
  }
  const res = await fetch(url.toString());
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`FERNS API error ${res.status}: ${body}`);
  }
  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new Error(`FERNS API returned non-JSON: ${body.slice(0, 200)}`);
  }
}

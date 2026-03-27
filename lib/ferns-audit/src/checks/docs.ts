import { fetchJson, headUrl, isAbsoluteUrl } from "../http.js";
import type { DocCheckResult, UrlCheckResult } from "../types.js";

export async function checkApiDocs(fernsBase: string): Promise<DocCheckResult[]> {
  const docPaths = [
    { path: "/api/openapi.yaml", expectedType: "yaml" },
    { path: "/api/openapi.json", expectedType: "json" },
  ];

  const results: DocCheckResult[] = [];

  for (const { path } of docPaths) {
    const url = `${fernsBase}${path}`;
    try {
      const res = await fetch(url);
      const contentType = res.headers.get("content-type") ?? "";
      results.push({
        path,
        url,
        status: res.status,
        contentType,
        ok: res.status === 200,
      });
    } catch (err) {
      results.push({
        path,
        url,
        ok: false,
        error: String(err),
      });
    }
  }

  return results;
}

export interface RegistryCheckResult {
  ok: boolean;
  error?: string;
  sources: Array<{
    source_id: string;
    metadata_url_check?: UrlCheckResult;
    explorer_url_check?: UrlCheckResult;
  }>;
}

export async function checkRegistry(fernsBase: string): Promise<RegistryCheckResult> {
  const registryUrl = `${fernsBase}/api/v1/sources`;

  try {
    const raw = await fetchJson(registryUrl) as Record<string, unknown>;
    const data = raw.data as Record<string, unknown> | undefined;
    const sources = (data?.sources ?? []) as Array<Record<string, unknown>>;

    const sourceResults: RegistryCheckResult["sources"] = [];

    for (const source of sources) {
      const sourceId = source.source_id as string;
      const metadataUrl = source.metadata_url as string | undefined;
      const explorerUrl = source.explorer_url as string | undefined;

      let metadataCheck: UrlCheckResult | undefined;
      if (metadataUrl) {
        metadataCheck = await checkUrl(metadataUrl, "metadata_url", sourceId);
      }

      let explorerCheck: UrlCheckResult | undefined;
      if (explorerUrl) {
        explorerCheck = await checkUrl(explorerUrl, "explorer_url", sourceId);
      }

      sourceResults.push({
        source_id: sourceId,
        metadata_url_check: metadataCheck,
        explorer_url_check: explorerCheck,
      });
    }

    return { ok: true, sources: sourceResults };
  } catch (err) {
    return { ok: false, error: String(err), sources: [] };
  }
}

async function checkUrl(url: string, field: string, context: string): Promise<UrlCheckResult> {
  const absolute = isAbsoluteUrl(url);
  if (!absolute) {
    return { url, field, context, isAbsolute: false, ok: false, error: "URL is not absolute" };
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

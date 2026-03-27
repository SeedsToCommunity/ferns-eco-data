export type FindingType = "gap" | "addition" | "mismatch" | "name_diff" | "ok";

export interface FieldFinding {
  type: FindingType;
  sourceField: string;
  fernsField?: string;
  sourceValue?: unknown;
  fernsValue?: unknown;
  note?: string;
}

export interface EndpointComparison {
  source: string;
  endpoint: string;
  label: string;
  ok: boolean;
  error?: string;
  rawSource?: Record<string, unknown>;
  rawFerns?: Record<string, unknown>;
  findings: FieldFinding[];
  urlsCollected: UrlEntry[];
}

export interface UrlEntry {
  url: string;
  field: string;
  context: string;
}

export interface UrlCheckResult {
  url: string;
  field: string;
  context: string;
  isAbsolute: boolean;
  status?: number;
  ok: boolean;
  error?: string;
}

export interface DocCheckResult {
  path: string;
  url: string;
  status?: number;
  contentType?: string;
  ok: boolean;
  error?: string;
}

export interface AuditReport {
  generatedAt: string;
  fernsBaseUrl: string;
  docChecks: DocCheckResult[];
  registryCheck: {
    ok: boolean;
    error?: string;
    sources: Array<{
      source_id: string;
      metadata_url_check?: UrlCheckResult;
      explorer_url_check?: UrlCheckResult;
    }>;
  };
  comparisons: EndpointComparison[];
  urlChecks: UrlCheckResult[];
}

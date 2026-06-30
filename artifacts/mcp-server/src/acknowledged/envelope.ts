export interface AcknowledgedEnvelope {
  found: boolean;
  permission_granted: boolean;
  pagination: { has_more: boolean; next: string | null; total: number | null } | null;
  provenance: {
    source_id: string;
    source_url: string;
    method: "api_fetch";
    cache_status: "none";
    queried_at: string;
    derived_from: null;
    license: string;
    rights: string;
  };
  data: unknown;
}

export interface BuildAcknowledgedEnvelopeOpts {
  sourceId: string;
  sourceUrl: string;
  license: string;
  rights: string;
  found: boolean;
  data: unknown;
  pagination?: { has_more: boolean; next: string | null; total: number | null } | null;
}

export function buildAcknowledgedEnvelope(
  opts: BuildAcknowledgedEnvelopeOpts,
): AcknowledgedEnvelope {
  return {
    found: opts.found,
    permission_granted: true,
    pagination: opts.pagination ?? null,
    provenance: {
      source_id: opts.sourceId,
      source_url: opts.sourceUrl,
      method: "api_fetch",
      cache_status: "none",
      queried_at: new Date().toISOString(),
      derived_from: null,
      license: opts.license,
      rights: opts.rights,
    },
    data: opts.data,
  };
}

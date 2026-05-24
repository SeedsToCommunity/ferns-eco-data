// FERNS Response Envelope Contract v1 — TypeScript types.
// Authoritative definition lives in replit.md "FERNS Response Envelope Contract v1".
// This module mirrors that contract; if the two diverge, replit.md wins and this
// file must be updated.

export const METHODS = ["api_fetch", "cache_hit", "computed"] as const;
export type Method = (typeof METHODS)[number];

export const CACHE_STATUSES = ["hit", "miss", "stale", "bypass"] as const;
export type CacheStatus = (typeof CACHE_STATUSES)[number];

// Source kinds per the "How each source kind fills the envelope" table in the
// contract. Names match the task-161 spec (kebab-case).
export const SOURCE_KINDS = [
  "in-memory",
  "pure-algorithm",
  "single-source-proxy",
  "multi-source-algorithm",
] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

export interface DerivedFromEntry {
  source_id: string;
  queried_at: string;
}

export interface Pagination {
  has_more: boolean;
  next: string | null;
  total: number | null;
}

export interface Provenance {
  source_id: string;
  source_url: string | null;
  method: Method;
  cache_status: CacheStatus;
  queried_at: string;
  derived_from: DerivedFromEntry[] | null;
  license: string;
  rights: string;
}

export interface Envelope<T = unknown> {
  found: boolean;
  permission_granted: boolean;
  pagination: Pagination | null;
  provenance: Provenance;
  data: T;
}

// Registry record fields the builder reads. Kept minimal so callers can pass any
// subset of the full ferns_sources row.
export interface RegistryRecord {
  license: string;
  rights: string;
  permission_granted?: boolean;
}

// Pluggable registry accessor. Implementations may query Postgres, an in-memory
// map, or a test stub. Returns `null` when the source is not registered.
export interface RegistryAccessor {
  getSource(sourceId: string): Promise<RegistryRecord | null>;
}

export interface BuildEnvelopeInput<T = unknown> {
  // Identity + classification.
  sourceId: string;
  sourceKind: SourceKind;

  // Payload + presence.
  found: boolean;
  data: T;

  // Envelope provenance (FERNS-produced).
  method: Method;
  cacheStatus: CacheStatus;
  sourceUrl: string | null;
  queriedAt: string;

  // Optional / kind-dependent fields.
  pagination?: Pagination | null;
  derivedFrom?: DerivedFromEntry[] | null;

  // Per-endpoint permission. Falls back to the source-level registry value
  // when omitted. The builder does NOT compute endpoint-kind defaults — that
  // is the caller's responsibility, sourced from `non_passthrough_endpoints`.
  permissionGranted?: boolean;

  // Per-endpoint overrides for the source-level registry license/rights.
  licenseOverride?: string;
  rightsOverride?: string;
}

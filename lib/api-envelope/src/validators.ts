// Pure validators for the FERNS envelope contract. Each function throws on
// violation. The builder composes them; tests exercise them individually.

import {
  CACHE_STATUSES,
  METHODS,
  SOURCE_KINDS,
  type CacheStatus,
  type DerivedFromEntry,
  type Method,
  type SourceKind,
} from "./types.js";

export class EnvelopeContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvelopeContractError";
  }
}

export function assertMethod(value: unknown): asserts value is Method {
  if (typeof value !== "string" || !(METHODS as readonly string[]).includes(value)) {
    throw new EnvelopeContractError(
      `Invalid method: ${JSON.stringify(value)}. Allowed: ${METHODS.join(", ")}.`,
    );
  }
}

export function assertCacheStatus(value: unknown): asserts value is CacheStatus {
  if (typeof value !== "string" || !(CACHE_STATUSES as readonly string[]).includes(value)) {
    throw new EnvelopeContractError(
      `Invalid cache_status: ${JSON.stringify(value)}. Allowed: ${CACHE_STATUSES.join(", ")}.`,
    );
  }
}

export function assertSourceKind(value: unknown): asserts value is SourceKind {
  if (typeof value !== "string" || !(SOURCE_KINDS as readonly string[]).includes(value)) {
    throw new EnvelopeContractError(
      `Invalid sourceKind: ${JSON.stringify(value)}. Allowed: ${SOURCE_KINDS.join(", ")}.`,
    );
  }
}

// Refinement #7 from the contract: method/cache_status are coupled. Only the
// pairs in this table are valid; everything else is a defective response.
const VALID_PAIRS: ReadonlySet<string> = new Set([
  "api_fetch|miss",
  "cache_hit|hit",
  "cache_hit|stale",
  "computed|bypass",
  "computed|hit",
]);

export function assertMethodCacheStatusPair(method: Method, cacheStatus: CacheStatus): void {
  const key = `${method}|${cacheStatus}`;
  if (!VALID_PAIRS.has(key)) {
    throw new EnvelopeContractError(
      `Invalid method/cache_status pair: ${method} + ${cacheStatus}. ` +
        `Valid pairs: api_fetch+miss, cache_hit+hit, cache_hit+stale, computed+bypass, computed+hit.`,
    );
  }
}

// Per the contract's "How each source kind fills the envelope" table:
// in-memory and pure-algorithm sources contact no external system, so
// `source_url` MUST be null. Single-source-proxy and multi-source-algorithm
// may have a non-null source_url (proxy always does; multi-source may if the
// composite computation is itself remotely sourced — uncommon).
export function assertSourceUrlForKind(sourceKind: SourceKind, sourceUrl: string | null): void {
  if ((sourceKind === "in-memory" || sourceKind === "pure-algorithm") && sourceUrl !== null) {
    throw new EnvelopeContractError(
      `source_url must be null for sourceKind="${sourceKind}" (no external system contacted). ` +
        `Received: ${JSON.stringify(sourceUrl)}.`,
    );
  }
}

// derived_from is meaningful only for multi-source-algorithm. Every other kind
// must pass null or omit the field. Empty arrays are also rejected, because
// the contract (replit.md "How each source kind fills the envelope" table)
// specifies `null` for non-multi kinds — not an empty array.
export function assertDerivedFromForKind(
  sourceKind: SourceKind,
  derivedFrom: DerivedFromEntry[] | null | undefined,
): void {
  if (sourceKind === "multi-source-algorithm") {
    return;
  }
  if (Array.isArray(derivedFrom)) {
    throw new EnvelopeContractError(
      `derived_from must be null (or omitted) for sourceKind="${sourceKind}". ` +
        `Only sourceKind="multi-source-algorithm" may set derived_from. ` +
        `Received an array of length ${derivedFrom.length}.`,
    );
  }
}

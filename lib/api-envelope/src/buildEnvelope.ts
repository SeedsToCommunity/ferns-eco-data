// buildEnvelope — the single source of envelope assembly for every FERNS route.
//
// Contract: lib/api-envelope is a pure assembler + validator. It does NOT
// compute per-endpoint permission_granted defaults from endpoint kinds — that
// is the caller's responsibility, sourced from `non_passthrough_endpoints`
// in the registry. The builder accepts a per-call permissionGranted and falls
// back to the source-level registry value when omitted.

import {
  assertCacheStatus,
  assertDerivedFromForKind,
  assertMethod,
  assertMethodCacheStatusPair,
  assertSourceKind,
  assertSourceUrlForKind,
  EnvelopeContractError,
} from "./validators.js";
import type {
  BuildEnvelopeInput,
  Envelope,
  RegistryAccessor,
} from "./types.js";

export interface BuildEnvelopeDeps {
  registry: RegistryAccessor;
}

export async function buildEnvelope<T>(
  input: BuildEnvelopeInput<T>,
  deps: BuildEnvelopeDeps,
): Promise<Envelope<T>> {
  // Static validations first — these are pure and order-independent.
  assertSourceKind(input.sourceKind);
  assertMethod(input.method);
  assertCacheStatus(input.cacheStatus);
  assertMethodCacheStatusPair(input.method, input.cacheStatus);
  assertSourceUrlForKind(input.sourceKind, input.sourceUrl);
  assertDerivedFromForKind(input.sourceKind, input.derivedFrom);

  // Registry lookup for license / rights / source-level permission.
  const record = await deps.registry.getSource(input.sourceId);
  if (!record) {
    throw new EnvelopeContractError(
      `Source not registered: ${JSON.stringify(input.sourceId)}. ` +
        `Cannot build envelope without a registry entry.`,
    );
  }

  const license = input.licenseOverride ?? record.license;
  const rights = input.rightsOverride ?? record.rights;

  // Per-endpoint permission_granted with source-level fallback. If neither is
  // provided we default to true — same as the prototype-mode behavior recorded
  // in replit.md (the launch-time behavior is still an open question).
  const permissionGranted =
    input.permissionGranted ?? record.permission_granted ?? true;

  return {
    found: input.found,
    permission_granted: permissionGranted,
    pagination: input.pagination ?? null,
    provenance: {
      source_id: input.sourceId,
      source_url: input.sourceUrl,
      method: input.method,
      cache_status: input.cacheStatus,
      queried_at: input.queriedAt,
      derived_from: input.derivedFrom ?? null,
      license,
      rights,
    },
    data: input.data,
  };
}

// Unit tests for buildEnvelope and its validators.
// Run via: pnpm --filter @workspace/api-envelope test
// (uses node:test through tsx — no external test framework dependency).

import test from "node:test";
import assert from "node:assert/strict";

import { buildEnvelope } from "../src/buildEnvelope.js";
import {
  assertCacheStatus,
  assertDerivedFromForKind,
  assertMethod,
  assertMethodCacheStatusPair,
  assertSourceUrlForKind,
  EnvelopeContractError,
} from "../src/validators.js";
import type { RegistryAccessor, RegistryRecord } from "../src/index.js";

function stubRegistry(records: Record<string, RegistryRecord>): RegistryAccessor {
  return {
    async getSource(sourceId) {
      return records[sourceId] ?? null;
    },
  };
}

const REG = stubRegistry({
  gbif: {
    license: "https://creativecommons.org/licenses/by/4.0/",
    rights: "GBIF.org and contributors. CC BY 4.0.",
    permission_granted: true,
  },
  inat: {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    rights: "iNaturalist contributors. CC BY-NC 4.0.",
    permission_granted: false,
  },
  vocab: {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    rights: "FERNS vocabulary, CC0.",
  },
});

const NOW = "2026-05-24T00:00:00.000Z";

// ---------------------------------------------------------------------------
// Happy paths
// ---------------------------------------------------------------------------

test("happy path: single-source-proxy api_fetch+miss builds full envelope", async () => {
  const env = await buildEnvelope(
    {
      sourceId: "gbif",
      sourceKind: "single-source-proxy",
      found: true,
      data: { scientificName: "Quercus alba" },
      method: "api_fetch",
      cacheStatus: "miss",
      sourceUrl: "https://api.gbif.org/v1/species/match?name=Quercus%20alba",
      queriedAt: NOW,
    },
    { registry: REG },
  );
  assert.equal(env.found, true);
  assert.equal(env.permission_granted, true);
  assert.equal(env.pagination, null);
  assert.equal(env.provenance.source_id, "gbif");
  assert.equal(env.provenance.method, "api_fetch");
  assert.equal(env.provenance.cache_status, "miss");
  assert.equal(env.provenance.license, "https://creativecommons.org/licenses/by/4.0/");
  assert.equal(env.provenance.derived_from, null);
  assert.deepEqual(env.data, { scientificName: "Quercus alba" });
});

test("happy path: in-memory source with cache_hit+hit and null source_url", async () => {
  const env = await buildEnvelope(
    {
      sourceId: "vocab",
      sourceKind: "in-memory",
      found: true,
      data: [{ code: "OBL", meaning: "Obligate wetland" }],
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: NOW,
    },
    { registry: REG },
  );
  assert.equal(env.provenance.source_url, null);
  assert.equal(env.provenance.method, "cache_hit");
});

test("happy path: multi-source-algorithm with derived_from", async () => {
  const env = await buildEnvelope(
    {
      sourceId: "vocab",
      sourceKind: "multi-source-algorithm",
      found: true,
      data: { score: 7 },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: NOW,
      derivedFrom: [{ source_id: "gbif", queried_at: NOW }],
    },
    { registry: REG },
  );
  assert.deepEqual(env.provenance.derived_from, [{ source_id: "gbif", queried_at: NOW }]);
});

test("happy path: per-call permissionGranted overrides registry value", async () => {
  const env = await buildEnvelope(
    {
      sourceId: "inat",
      sourceKind: "single-source-proxy",
      found: true,
      data: {},
      method: "api_fetch",
      cacheStatus: "miss",
      sourceUrl: "https://api.inaturalist.org/v1/places/1",
      queriedAt: NOW,
      permissionGranted: true,
    },
    { registry: REG },
  );
  assert.equal(env.permission_granted, true);
});

test("happy path: registry fallback applied when permissionGranted omitted", async () => {
  const env = await buildEnvelope(
    {
      sourceId: "inat",
      sourceKind: "single-source-proxy",
      found: true,
      data: {},
      method: "api_fetch",
      cacheStatus: "miss",
      sourceUrl: "https://api.inaturalist.org/v1/places/1",
      queriedAt: NOW,
    },
    { registry: REG },
  );
  assert.equal(env.permission_granted, false);
});

test("happy path: licenseOverride and rightsOverride win over registry values", async () => {
  const env = await buildEnvelope(
    {
      sourceId: "gbif",
      sourceKind: "single-source-proxy",
      found: true,
      data: {},
      method: "api_fetch",
      cacheStatus: "miss",
      sourceUrl: "https://api.gbif.org/v1/x",
      queriedAt: NOW,
      licenseOverride: "https://creativecommons.org/publicdomain/zero/1.0/",
      rightsOverride: "Specific endpoint waiver.",
    },
    { registry: REG },
  );
  assert.equal(env.provenance.license, "https://creativecommons.org/publicdomain/zero/1.0/");
  assert.equal(env.provenance.rights, "Specific endpoint waiver.");
});

// ---------------------------------------------------------------------------
// Validation rejections (one test per rule from task-161 "Done looks like")
// ---------------------------------------------------------------------------

test("rejects unknown method value", () => {
  assert.throws(() => assertMethod("upstream_fetch"), EnvelopeContractError);
  assert.throws(() => assertMethod(""), EnvelopeContractError);
  assert.throws(() => assertMethod(123), EnvelopeContractError);
});

test("rejects unknown cache_status value", () => {
  assert.throws(() => assertCacheStatus("warm"), EnvelopeContractError);
  assert.throws(() => assertCacheStatus(null), EnvelopeContractError);
});

test("rejects invalid method+cache_status pair", () => {
  // api_fetch+hit is not a valid pair — live fetches are always misses.
  assert.throws(
    () => assertMethodCacheStatusPair("api_fetch", "hit"),
    EnvelopeContractError,
  );
  // cache_hit+miss is contradictory.
  assert.throws(
    () => assertMethodCacheStatusPair("cache_hit", "miss"),
    EnvelopeContractError,
  );
  // computed+stale is not in the valid set.
  assert.throws(
    () => assertMethodCacheStatusPair("computed", "stale"),
    EnvelopeContractError,
  );
});

test("accepts all five valid method+cache_status pairs", () => {
  assertMethodCacheStatusPair("api_fetch", "miss");
  assertMethodCacheStatusPair("cache_hit", "hit");
  assertMethodCacheStatusPair("cache_hit", "stale");
  assertMethodCacheStatusPair("computed", "bypass");
  assertMethodCacheStatusPair("computed", "hit");
});

test("rejects non-null source_url for in-memory sourceKind", () => {
  assert.throws(
    () => assertSourceUrlForKind("in-memory", "https://example.org/x"),
    EnvelopeContractError,
  );
});

test("rejects non-null source_url for pure-algorithm sourceKind", () => {
  assert.throws(
    () => assertSourceUrlForKind("pure-algorithm", "https://example.org/x"),
    EnvelopeContractError,
  );
});

test("accepts null source_url for in-memory and pure-algorithm", () => {
  assertSourceUrlForKind("in-memory", null);
  assertSourceUrlForKind("pure-algorithm", null);
});

test("rejects populated derived_from for non multi-source-algorithm sources", () => {
  assert.throws(
    () =>
      assertDerivedFromForKind("single-source-proxy", [
        { source_id: "gbif", queried_at: NOW },
      ]),
    EnvelopeContractError,
  );
  assert.throws(
    () =>
      assertDerivedFromForKind("in-memory", [
        { source_id: "gbif", queried_at: NOW },
      ]),
    EnvelopeContractError,
  );
});

test("rejects empty-array derived_from for non multi-source-algorithm sources (contract requires null)", () => {
  assert.throws(
    () => assertDerivedFromForKind("single-source-proxy", []),
    EnvelopeContractError,
  );
  assert.throws(
    () => assertDerivedFromForKind("in-memory", []),
    EnvelopeContractError,
  );
  assert.throws(
    () => assertDerivedFromForKind("pure-algorithm", []),
    EnvelopeContractError,
  );
});

test("accepts null/undefined derived_from for any non-multi sourceKind", () => {
  assertDerivedFromForKind("single-source-proxy", null);
  assertDerivedFromForKind("in-memory", undefined);
  assertDerivedFromForKind("pure-algorithm", null);
});

test("accepts populated and empty derived_from for multi-source-algorithm", () => {
  assertDerivedFromForKind("multi-source-algorithm", [
    { source_id: "gbif", queried_at: NOW },
  ]);
  assertDerivedFromForKind("multi-source-algorithm", []);
  assertDerivedFromForKind("multi-source-algorithm", null);
});

// ---------------------------------------------------------------------------
// Builder-level integration rejections
// ---------------------------------------------------------------------------

test("buildEnvelope rejects when source is not registered", async () => {
  await assert.rejects(
    () =>
      buildEnvelope(
        {
          sourceId: "does-not-exist",
          sourceKind: "single-source-proxy",
          found: true,
          data: {},
          method: "api_fetch",
          cacheStatus: "miss",
          sourceUrl: "https://example.org/x",
          queriedAt: NOW,
        },
        { registry: REG },
      ),
    EnvelopeContractError,
  );
});

test("buildEnvelope propagates pair-violation as EnvelopeContractError", async () => {
  await assert.rejects(
    () =>
      buildEnvelope(
        {
          sourceId: "gbif",
          sourceKind: "single-source-proxy",
          found: true,
          data: {},
          method: "api_fetch",
          cacheStatus: "hit",
          sourceUrl: "https://api.gbif.org/v1/x",
          queriedAt: NOW,
        },
        { registry: REG },
      ),
    EnvelopeContractError,
  );
});

import { Router, type IRouter } from "express";
import { db, lbjUrlCacheTable, speciesPageTextCacheTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import {
  LADY_BIRD_JOHNSON_SOURCE_ID,
  LADY_BIRD_JOHNSON_REGISTRY_ENTRY,
  LADY_BIRD_JOHNSON_LICENSES,
  LADY_BIRD_JOHNSON_LICENSE_NOTES,
} from "../services/lady-bird-johnson/metadata.js";
import { ensureLadyBirdJohnsonRegistryEntry } from "../services/lady-bird-johnson/seed.js";
import {
  getLadyBirdJohnsonUrl,
  getLadyBirdJohnsonSpeciesInformation,
  type LadyBirdJohnsonStatus,
} from "@workspace/external-data-providers/lady-bird-johnson";
import { resolveUrl } from "../lib/resolve-url.js";
import { buildEnvelope } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

const LBJ_PROFILE_BASE = "https://www.wildflower.org/plants/result.php";
const LBJ_TTL_FOUND_MS = 90 * 24 * 60 * 60 * 1000;
const LBJ_TTL_NOT_FOUND_MS = 30 * 24 * 60 * 60 * 1000;
const LBJ_VERIFICATION_METHOD = "http_get_manual_redirect";

function missingSymbolError() {
  return {
    error: "invalid_input",
    message:
      "usda_symbol query parameter is required (e.g. ?usda_symbol=TRGI). " +
      "Obtain the USDA Plants symbol by querying the USDA PLANTS source at /api/usda-plants.",
  };
}

// ── Routes ─────────────────────────────────────────────────────────────────────

router.get("/lady-bird-johnson/metadata", async (req, res) => {
  await ensureLadyBirdJohnsonRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: LADY_BIRD_JOHNSON_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: "https://www.wildflower.org/",
      method: "computed",
      cacheStatus: "bypass",
      queriedAt: new Date().toISOString(),
      found: true,
      data: {
        service_id: LADY_BIRD_JOHNSON_SOURCE_ID,
        service_name: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.name,
        licenses: LADY_BIRD_JOHNSON_LICENSES,
        license_notes: LADY_BIRD_JOHNSON_LICENSE_NOTES,
        url_strategy: LBJ_VERIFICATION_METHOD,
        url_pattern: `${LBJ_PROFILE_BASE}?id_plant={USDA_SYMBOL}`,
        validation: "http_get with redirect:manual (200=found, 3xx=not_found)",
        input_note:
          "Accepts USDA Plants symbols (e.g. TRGI for Trillium grandiflorum). " +
          "Obtain symbols from /api/usda-plants.",
        cache_table: "lbj_url_cache",
        cache_ttl_found_days: 90,
        cache_ttl_not_found_days: 30,
        species_text_cache: "species_page_text_cache (site_id=lady-bird-johnson, permanent)",
        registry_entry: {
          ...LADY_BIRD_JOHNSON_REGISTRY_ENTRY,
          metadata_url: resolveUrl(req, LADY_BIRD_JOHNSON_REGISTRY_ENTRY.metadata_url),
        },
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/lady-bird-johnson", async (req, res) => {
  await ensureLadyBirdJohnsonRegistryEntry();

  const symbolParam =
    typeof req.query["usda_symbol"] === "string" ? req.query["usda_symbol"].trim() : null;
  if (!symbolParam) {
    res.status(400).json(missingSymbolError());
    return;
  }

  const usdaSymbolUpper = symbolParam.toUpperCase();
  const cacheKey = `lbj:${usdaSymbolUpper}`;

  const cached = await db
    .select()
    .from(lbjUrlCacheTable)
    .where(eq(lbjUrlCacheTable.cache_key, cacheKey))
    .limit(1);

  if (cached.length > 0) {
    const hit = cached[0];
    if (!hit.expires_at || hit.expires_at > new Date()) {
      const found = hit.found === true;
      const envelope = await buildEnvelope(
        {
          sourceId: LADY_BIRD_JOHNSON_SOURCE_ID,
          sourceKind: "single-source-proxy",
          sourceUrl: found ? hit.profile_url : null,
          method: "cache_hit",
          cacheStatus: "hit",
          queriedAt: hit.fetched_at.toISOString(),
          found,
          data: found ? { profile_url: hit.profile_url } : null,
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  const result = await getLadyBirdJohnsonUrl(usdaSymbolUpper);
  const fetchedAt = new Date();

  if (result.status !== "unverified") {
    const status = result.status as LadyBirdJohnsonStatus;
    const expiresAt =
      status === "found"
        ? new Date(fetchedAt.getTime() + LBJ_TTL_FOUND_MS)
        : new Date(fetchedAt.getTime() + LBJ_TTL_NOT_FOUND_MS);

    await db
      .insert(lbjUrlCacheTable)
      .values({
        cache_key: cacheKey,
        usda_symbol: usdaSymbolUpper,
        profile_url: result.profileUrl,
        source_url: resolveUrl(req, "/api/lady-bird-johnson"),
        upstream_url: result.profileUrl,
        status,
        found: result.found,
        http_status: result.httpStatus,
        method: LBJ_VERIFICATION_METHOD,
        verified_at: fetchedAt,
        expires_at: expiresAt,
        fetched_at: fetchedAt,
      })
      .onConflictDoUpdate({
        target: lbjUrlCacheTable.cache_key,
        set: {
          usda_symbol: usdaSymbolUpper,
          profile_url: result.profileUrl,
          source_url: resolveUrl(req, "/api/lady-bird-johnson"),
          upstream_url: result.profileUrl,
          status,
          found: result.found,
          http_status: result.httpStatus,
          method: LBJ_VERIFICATION_METHOD,
          verified_at: fetchedAt,
          expires_at: expiresAt,
          fetched_at: fetchedAt,
        },
      });
  }

  const envelope = await buildEnvelope(
    {
      sourceId: LADY_BIRD_JOHNSON_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: result.profileUrl,
      method: "api_fetch",
      cacheStatus: "miss",
      queriedAt: fetchedAt.toISOString(),
      found: result.found,
      data: result.found ? { profile_url: result.profileUrl } : null,
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/lady-bird-johnson/species-text", async (req, res) => {
  await ensureLadyBirdJohnsonRegistryEntry();

  const symbolParam =
    typeof req.query["usda_symbol"] === "string" ? req.query["usda_symbol"].trim() : null;
  if (!symbolParam) {
    res.status(400).json(missingSymbolError());
    return;
  }

  const usdaSymbolUpper = symbolParam.toUpperCase();
  const refresh = req.query["refresh"] === "true";

  if (!refresh) {
    const cached = await db
      .select()
      .from(speciesPageTextCacheTable)
      .where(
        and(
          eq(speciesPageTextCacheTable.site_id, LADY_BIRD_JOHNSON_SOURCE_ID),
          eq(speciesPageTextCacheTable.scientific_name, usdaSymbolUpper),
        ),
      )
      .limit(1);

    if (cached.length > 0) {
      const hit = cached[0];
      const envelope = await buildEnvelope(
        {
          sourceId: LADY_BIRD_JOHNSON_SOURCE_ID,
          sourceKind: "single-source-proxy",
          sourceUrl: hit.found ? hit.url : null,
          method: "cache_hit",
          cacheStatus: "hit",
          queriedAt: hit.scraped_at.toISOString(),
          found: hit.found,
          data: hit.found
            ? {
                sections: hit.sections as Record<string, string> | null,
                full_text: hit.full_text,
              }
            : null,
        },
        { registry: dbRegistryAccessor },
      );
      return res.json(envelope);
    }
  }

  const result = await getLadyBirdJohnsonSpeciesInformation(usdaSymbolUpper);
  const fetchedAt = new Date();

  // Only cache definitive outcomes: found (200) or explicit not_found (3xx).
  // Network failures / 5xx (fetchError !== null) are not cached.
  if (result.found || result.fetchError === null) {
    await db
      .insert(speciesPageTextCacheTable)
      .values({
        site_id: LADY_BIRD_JOHNSON_SOURCE_ID,
        scientific_name: usdaSymbolUpper,
        url: result.found ? result.url : null,
        found: result.found,
        sections: result.sections ?? null,
        full_text: result.fullText ?? null,
      })
      .onConflictDoUpdate({
        target: [speciesPageTextCacheTable.site_id, speciesPageTextCacheTable.scientific_name],
        set: {
          url: result.found ? result.url : null,
          found: result.found,
          sections: result.sections ?? null,
          full_text: result.fullText ?? null,
          scraped_at: fetchedAt,
        },
      });

    const lbjStatus: LadyBirdJohnsonStatus = result.found ? "found" : "not_found";
    const expiresAt =
      result.found
        ? new Date(fetchedAt.getTime() + LBJ_TTL_FOUND_MS)
        : new Date(fetchedAt.getTime() + LBJ_TTL_NOT_FOUND_MS);

    await db
      .insert(lbjUrlCacheTable)
      .values({
        cache_key: `lbj:${usdaSymbolUpper}`,
        usda_symbol: usdaSymbolUpper,
        profile_url: result.found ? result.url : null,
        status: lbjStatus,
        found: result.found,
        method: LBJ_VERIFICATION_METHOD,
        verified_at: fetchedAt,
        expires_at: expiresAt,
        fetched_at: fetchedAt,
      })
      .onConflictDoUpdate({
        target: lbjUrlCacheTable.cache_key,
        set: {
          profile_url: result.found ? result.url : null,
          status: lbjStatus,
          found: result.found,
          method: LBJ_VERIFICATION_METHOD,
          verified_at: fetchedAt,
          expires_at: expiresAt,
          fetched_at: fetchedAt,
        },
      });
  }

  const envelope = await buildEnvelope(
    {
      sourceId: LADY_BIRD_JOHNSON_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: result.found ? result.url : null,
      method: "api_fetch",
      cacheStatus: "miss",
      queriedAt: fetchedAt.toISOString(),
      found: result.found,
      data: result.found
        ? { sections: result.sections, full_text: result.fullText }
        : null,
    },
    { registry: dbRegistryAccessor },
  );
  return res.json(envelope);
});

export default router;

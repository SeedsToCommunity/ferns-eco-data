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
import { extractLadyBirdJohnson, removeNoiseBlocks } from "../services/botanical-refs/scraper.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { buildEnvelope } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

const LBJ_PROFILE_BASE = "https://www.wildflower.org/plants/result.php";
const LBJ_TTL_FOUND_MS = 90 * 24 * 60 * 60 * 1000;
const LBJ_TTL_NOT_FOUND_MS = 30 * 24 * 60 * 60 * 1000;
const LBJ_BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const LBJ_VERIFICATION_METHOD = "http_get_manual_redirect";

function buildProfileUrl(usdaSymbol: string): string {
  return `${LBJ_PROFILE_BASE}?id_plant=${encodeURIComponent(usdaSymbol)}`;
}

function missingSymbolError() {
  return {
    error: "invalid_input",
    message:
      "usda_symbol query parameter is required (e.g. ?usda_symbol=TRGI). " +
      "Obtain the USDA Plants symbol by querying the USDA PLANTS source at /api/usda-plants.",
  };
}

// ── Symbol verification via lbj_url_cache ──────────────────────────────────────

interface VerifyResult {
  usdaSymbol: string;
  profileUrl: string | null;
  status: "found" | "not_found" | "unverified";
  found: boolean;
  httpStatus: number | null;
  verifiedAt: Date | null;
  cacheHit: boolean;
}

async function verifySymbol(usdaSymbolUpper: string, fernsSourceUrl: string): Promise<VerifyResult> {
  const cacheKey = `lbj:${usdaSymbolUpper}`;
  const profileUrl = buildProfileUrl(usdaSymbolUpper);

  const cached = await db
    .select()
    .from(lbjUrlCacheTable)
    .where(eq(lbjUrlCacheTable.cache_key, cacheKey))
    .limit(1);

  if (cached.length > 0) {
    const hit = cached[0];
    if (!hit.expires_at || hit.expires_at > new Date()) {
      const status = hit.status as "found" | "not_found" | "unverified";
      return {
        usdaSymbol: usdaSymbolUpper,
        profileUrl: hit.profile_url,
        status,
        found: status === "found",
        httpStatus: hit.http_status,
        verifiedAt: hit.verified_at ?? hit.fetched_at,
        cacheHit: true,
      };
    }
  }

  let status: "found" | "not_found" | "unverified" = "unverified";
  let httpStatus: number | null = null;
  let resolvedProfileUrl: string | null = null;
  let expiresAt: Date | null = null;
  const verifiedAt = new Date();

  try {
    const resp = await fetch(profileUrl, {
      method: "GET",
      headers: { "User-Agent": LBJ_BROWSER_UA },
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });
    httpStatus = resp.status;

    if (resp.status === 200) {
      status = "found";
      resolvedProfileUrl = profileUrl;
      expiresAt = new Date(Date.now() + LBJ_TTL_FOUND_MS);
    } else if (resp.status >= 300 && resp.status < 500) {
      status = "not_found";
      resolvedProfileUrl = null;
      expiresAt = new Date(Date.now() + LBJ_TTL_NOT_FOUND_MS);
    } else if (resp.status >= 500) {
      status = "unverified";
      resolvedProfileUrl = null;
    }
  } catch {
    status = "unverified";
  }

  const found = status === "found";

  if (status !== "unverified") {
    await db
      .insert(lbjUrlCacheTable)
      .values({
        cache_key: cacheKey,
        usda_symbol: usdaSymbolUpper,
        profile_url: resolvedProfileUrl,
        source_url: fernsSourceUrl,
        upstream_url: profileUrl,
        status,
        found,
        http_status: httpStatus,
        method: LBJ_VERIFICATION_METHOD,
        verified_at: verifiedAt,
        expires_at: expiresAt,
        fetched_at: verifiedAt,
      })
      .onConflictDoUpdate({
        target: lbjUrlCacheTable.cache_key,
        set: {
          usda_symbol: usdaSymbolUpper,
          profile_url: resolvedProfileUrl,
          source_url: fernsSourceUrl,
          upstream_url: profileUrl,
          status,
          found,
          http_status: httpStatus,
          method: LBJ_VERIFICATION_METHOD,
          verified_at: verifiedAt,
          expires_at: expiresAt,
          fetched_at: verifiedAt,
        },
      });
  }

  return {
    usdaSymbol: usdaSymbolUpper,
    profileUrl: resolvedProfileUrl,
    status,
    found,
    httpStatus,
    verifiedAt: status !== "unverified" ? verifiedAt : null,
    cacheHit: false,
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
          explorer_url: resolveUrl(req, LADY_BIRD_JOHNSON_REGISTRY_ENTRY.explorer_url),
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
  const fernsSourceUrl = resolveUrl(req, "/api/lady-bird-johnson");
  const verify = await verifySymbol(usdaSymbolUpper, fernsSourceUrl);

  const profileUrl = buildProfileUrl(usdaSymbolUpper);

  const envelope = await buildEnvelope(
    {
      sourceId: LADY_BIRD_JOHNSON_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: profileUrl,
      method: verify.cacheHit ? "cache_hit" : "api_fetch",
      cacheStatus: verify.cacheHit ? "hit" : "miss",
      queriedAt: (verify.verifiedAt ?? new Date()).toISOString(),
      found: verify.found,
      data: {
        usda_symbol: usdaSymbolUpper,
        profile_url: verify.profileUrl,
        status: verify.status,
        http_status: verify.httpStatus,
        validation_method: LBJ_VERIFICATION_METHOD,
        verified_at: verify.verifiedAt,
      },
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
  const profileUrl = buildProfileUrl(usdaSymbolUpper);

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
          sourceUrl: profileUrl,
          method: "cache_hit",
          cacheStatus: "hit",
          queriedAt: hit.scraped_at.toISOString(),
          found: hit.found,
          data: hit.found
            ? {
                usda_symbol: usdaSymbolUpper,
                url: hit.url,
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

  let found = false;
  let sections: Record<string, string> | null = null;
  let fullText: string | null = null;
  let definitiveOutcome = false;
  const scrapedAt = new Date();

  try {
    const resp = await fetch(profileUrl, {
      method: "GET",
      headers: {
        "User-Agent": LBJ_BROWSER_UA,
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });

    if (resp.status === 200) {
      definitiveOutcome = true;
      found = true;
      const html = await resp.text();
      const cleanHtml = removeNoiseBlocks(html);
      const extracted = extractLadyBirdJohnson(cleanHtml);
      sections = Object.keys(extracted.sections).length ? extracted.sections : null;
      fullText = extracted.full_text || null;

      await db
        .insert(lbjUrlCacheTable)
        .values({
          cache_key: `lbj:${usdaSymbolUpper}`,
          usda_symbol: usdaSymbolUpper,
          profile_url: profileUrl,
          status: "found",
          found: true,
          http_status: 200,
          method: LBJ_VERIFICATION_METHOD,
          verified_at: scrapedAt,
          expires_at: new Date(Date.now() + LBJ_TTL_FOUND_MS),
          fetched_at: scrapedAt,
        })
        .onConflictDoUpdate({
          target: lbjUrlCacheTable.cache_key,
          set: {
            profile_url: profileUrl,
            status: "found",
            found: true,
            http_status: 200,
            method: LBJ_VERIFICATION_METHOD,
            verified_at: scrapedAt,
            expires_at: new Date(Date.now() + LBJ_TTL_FOUND_MS),
            fetched_at: scrapedAt,
          },
        });
    } else if (resp.status >= 300 && resp.status < 500) {
      definitiveOutcome = true;
      found = false;

      await db
        .insert(lbjUrlCacheTable)
        .values({
          cache_key: `lbj:${usdaSymbolUpper}`,
          usda_symbol: usdaSymbolUpper,
          profile_url: null,
          status: "not_found",
          found: false,
          http_status: resp.status,
          method: LBJ_VERIFICATION_METHOD,
          verified_at: scrapedAt,
          expires_at: new Date(Date.now() + LBJ_TTL_NOT_FOUND_MS),
          fetched_at: scrapedAt,
        })
        .onConflictDoUpdate({
          target: lbjUrlCacheTable.cache_key,
          set: {
            profile_url: null,
            status: "not_found",
            found: false,
            http_status: resp.status,
            method: LBJ_VERIFICATION_METHOD,
            verified_at: scrapedAt,
            expires_at: new Date(Date.now() + LBJ_TTL_NOT_FOUND_MS),
            fetched_at: scrapedAt,
          },
        });
    }
  } catch {
    // network/5xx error — not cached; found remains false
  }

  if (definitiveOutcome) {
    await db
      .insert(speciesPageTextCacheTable)
      .values({
        site_id: LADY_BIRD_JOHNSON_SOURCE_ID,
        scientific_name: usdaSymbolUpper,
        url: found ? profileUrl : null,
        found,
        sections: sections ?? null,
        full_text: fullText,
      })
      .onConflictDoUpdate({
        target: [speciesPageTextCacheTable.site_id, speciesPageTextCacheTable.scientific_name],
        set: {
          url: found ? profileUrl : null,
          found,
          sections: sections ?? null,
          full_text: fullText,
          scraped_at: scrapedAt,
        },
      });
  }

  const envelope = await buildEnvelope(
    {
      sourceId: LADY_BIRD_JOHNSON_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: profileUrl,
      method: "api_fetch",
      cacheStatus: "miss",
      queriedAt: scrapedAt.toISOString(),
      found,
      data: found
        ? {
            usda_symbol: usdaSymbolUpper,
            url: profileUrl,
            sections,
            full_text: fullText,
          }
        : null,
    },
    { registry: dbRegistryAccessor },
  );
  return res.json(envelope);
});

export default router;

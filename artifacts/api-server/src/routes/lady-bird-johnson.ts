import { Router, type IRouter } from "express";
import { db, lbjUrlCacheTable, speciesPageTextCacheTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import {
  LADY_BIRD_JOHNSON_SOURCE_ID,
  LADY_BIRD_JOHNSON_GENERAL_SUMMARY,
  LADY_BIRD_JOHNSON_TECHNICAL_DETAILS,
  LADY_BIRD_JOHNSON_REGISTRY_ENTRY,
  LADY_BIRD_JOHNSON_PERMISSION_GRANTED,
  LADY_BIRD_JOHNSON_PERMISSION_STATUS,
} from "../services/lady-bird-johnson/metadata.js";
import { ensureLadyBirdJohnsonRegistryEntry } from "../services/lady-bird-johnson/seed.js";
import { extractLadyBirdJohnson, removeNoiseBlocks } from "../services/botanical-refs/scraper.js";
import { resolveUrl } from "../lib/resolve-url.js";

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

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: LADY_BIRD_JOHNSON_SOURCE_ID,
    fetched_at: new Date(),
    method: LBJ_VERIFICATION_METHOD,
    upstream_url: resolveUrl(req, "/api/lady-bird-johnson/metadata"),
    general_summary: LADY_BIRD_JOHNSON_GENERAL_SUMMARY,
    technical_details: LADY_BIRD_JOHNSON_TECHNICAL_DETAILS,
  };
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

async function verifySymbol(usdaSymbolUpper: string): Promise<VerifyResult> {
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
  let resolvedProfileUrl: string | null = profileUrl;
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
      expiresAt = new Date(Date.now() + LBJ_TTL_FOUND_MS);
    } else if (resp.status >= 300 && resp.status < 500) {
      status = "not_found";
      resolvedProfileUrl = null;
      expiresAt = new Date(Date.now() + LBJ_TTL_NOT_FOUND_MS);
    } else if (resp.status >= 500) {
      status = "unverified";
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
  res.json({
    service_id: LADY_BIRD_JOHNSON_SOURCE_ID,
    service_name: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.name,
    permission_granted: LADY_BIRD_JOHNSON_PERMISSION_GRANTED,
    permission_status: LADY_BIRD_JOHNSON_PERMISSION_STATUS,
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
    queried_at: new Date(),
    provenance: buildProvenance(req),
  });
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
  const verify = await verifySymbol(usdaSymbolUpper);

  res.json({
    found: verify.found,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/lady-bird-johnson"),
    provenance: { ...buildProvenance(req), matched_input: usdaSymbolUpper },
    data: {
      usda_symbol: usdaSymbolUpper,
      profile_url: verify.profileUrl,
      status: verify.status,
      found: verify.found,
      http_status: verify.httpStatus,
      validation_method: LBJ_VERIFICATION_METHOD,
      verified_at: verify.verifiedAt,
      cache_hit: verify.cacheHit,
    },
  });
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
      return res.json({
        found: hit.found,
        cache_status: "hit",
        scraped_at: hit.scraped_at,
        queried_at: new Date(),
        source_url: resolveUrl(req, "/api/lady-bird-johnson/species-text"),
        provenance: { ...buildProvenance(req), matched_input: usdaSymbolUpper },
        data: hit.found
          ? {
              usda_symbol: usdaSymbolUpper,
              url: hit.url,
              sections: hit.sections as Record<string, string> | null,
              full_text: hit.full_text,
            }
          : null,
      });
    }
  }

  let found = false;
  let sections: Record<string, string> | null = null;
  let fullText: string | null = null;
  let fetchError: string | undefined;
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
    } else {
      fetchError = `HTTP ${resp.status}`;
    }
  } catch (err) {
    fetchError = String(err);
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

  return res.json({
    found,
    cache_status: "miss",
    scraped_at: scrapedAt,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/lady-bird-johnson/species-text"),
    provenance: { ...buildProvenance(req), matched_input: usdaSymbolUpper },
    ...(fetchError ? { fetch_error: fetchError } : {}),
    data: found
      ? {
          usda_symbol: usdaSymbolUpper,
          url: profileUrl,
          sections,
          full_text: fullText,
        }
      : null,
  });
});

export default router;

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

function buildProfileUrl(symbol: string): string {
  return `${LBJ_PROFILE_BASE}?id_plant=${encodeURIComponent(symbol)}`;
}

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: LADY_BIRD_JOHNSON_SOURCE_ID,
    fetched_at: new Date(),
    method: "http_get_manual_redirect",
    upstream_url: resolveUrl(req, "/api/lady-bird-johnson/metadata"),
    general_summary: LADY_BIRD_JOHNSON_GENERAL_SUMMARY,
    technical_details: LADY_BIRD_JOHNSON_TECHNICAL_DETAILS,
  };
}

// ── Symbol verification via lbj_url_cache ──────────────────────────────────────

interface VerifyResult {
  symbol: string;
  profileUrl: string | null;
  status: "found" | "not_found" | "unverified";
  httpStatus: number | null;
  cacheHit: boolean;
}

async function verifySymbol(symbolUpper: string): Promise<VerifyResult> {
  const cacheKey = `lbj:${symbolUpper}`;
  const profileUrl = buildProfileUrl(symbolUpper);

  const cached = await db
    .select()
    .from(lbjUrlCacheTable)
    .where(eq(lbjUrlCacheTable.cache_key, cacheKey))
    .limit(1);

  if (cached.length > 0) {
    const hit = cached[0];
    if (!hit.expires_at || hit.expires_at > new Date()) {
      return {
        symbol: symbolUpper,
        profileUrl: hit.profile_url,
        status: hit.status as "found" | "not_found" | "unverified",
        httpStatus: hit.http_status,
        cacheHit: true,
      };
    }
  }

  let status: "found" | "not_found" | "unverified" = "unverified";
  let httpStatus: number | null = null;
  let resolvedProfileUrl: string | null = profileUrl;
  let expiresAt: Date | null = null;

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

  if (status !== "unverified") {
    await db
      .insert(lbjUrlCacheTable)
      .values({
        cache_key: cacheKey,
        symbol: symbolUpper,
        profile_url: resolvedProfileUrl,
        status,
        http_status: httpStatus,
        expires_at: expiresAt,
        fetched_at: new Date(),
      })
      .onConflictDoUpdate({
        target: lbjUrlCacheTable.cache_key,
        set: {
          symbol: symbolUpper,
          profile_url: resolvedProfileUrl,
          status,
          http_status: httpStatus,
          expires_at: expiresAt,
          fetched_at: new Date(),
        },
      });
  }

  return {
    symbol: symbolUpper,
    profileUrl: resolvedProfileUrl,
    status,
    httpStatus,
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
    url_strategy: "http_get_manual_redirect",
    url_pattern: `${LBJ_PROFILE_BASE}?id_plant={SYMBOL}`,
    validation: "http_get with redirect:manual (200=found, 3xx=not_found)",
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

  const symbolParam = typeof req.query["symbol"] === "string" ? req.query["symbol"].trim() : null;
  if (!symbolParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "symbol query parameter is required (e.g. ?symbol=TRGI)",
    });
    return;
  }

  const symbolUpper = symbolParam.toUpperCase();
  const verify = await verifySymbol(symbolUpper);

  res.json({
    found: verify.status === "found",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/lady-bird-johnson"),
    provenance: { ...buildProvenance(req), matched_input: symbolUpper },
    data: {
      symbol: symbolUpper,
      profile_url: verify.profileUrl,
      status: verify.status,
      http_status: verify.httpStatus,
      validation_method: "http_get_manual_redirect",
      cache_hit: verify.cacheHit,
    },
  });
});

router.get("/lady-bird-johnson/species-text", async (req, res) => {
  await ensureLadyBirdJohnsonRegistryEntry();

  const symbolParam = typeof req.query["symbol"] === "string" ? req.query["symbol"].trim() : null;
  if (!symbolParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "symbol query parameter is required (e.g. ?symbol=TRGI)",
    });
    return;
  }

  const symbolUpper = symbolParam.toUpperCase();
  const refresh = req.query["refresh"] === "true";
  const profileUrl = buildProfileUrl(symbolUpper);

  if (!refresh) {
    const cached = await db
      .select()
      .from(speciesPageTextCacheTable)
      .where(
        and(
          eq(speciesPageTextCacheTable.site_id, LADY_BIRD_JOHNSON_SOURCE_ID),
          eq(speciesPageTextCacheTable.scientific_name, symbolUpper),
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
        provenance: { ...buildProvenance(req), matched_input: symbolUpper },
        data: hit.found
          ? {
              symbol: symbolUpper,
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
          cache_key: `lbj:${symbolUpper}`,
          symbol: symbolUpper,
          profile_url: profileUrl,
          status: "found",
          http_status: 200,
          expires_at: new Date(Date.now() + LBJ_TTL_FOUND_MS),
          fetched_at: new Date(),
        })
        .onConflictDoUpdate({
          target: lbjUrlCacheTable.cache_key,
          set: {
            profile_url: profileUrl,
            status: "found",
            http_status: 200,
            expires_at: new Date(Date.now() + LBJ_TTL_FOUND_MS),
            fetched_at: new Date(),
          },
        });
    } else if (resp.status >= 300 && resp.status < 500) {
      definitiveOutcome = true;
      found = false;

      await db
        .insert(lbjUrlCacheTable)
        .values({
          cache_key: `lbj:${symbolUpper}`,
          symbol: symbolUpper,
          profile_url: null,
          status: "not_found",
          http_status: resp.status,
          expires_at: new Date(Date.now() + LBJ_TTL_NOT_FOUND_MS),
          fetched_at: new Date(),
        })
        .onConflictDoUpdate({
          target: lbjUrlCacheTable.cache_key,
          set: {
            profile_url: null,
            status: "not_found",
            http_status: resp.status,
            expires_at: new Date(Date.now() + LBJ_TTL_NOT_FOUND_MS),
            fetched_at: new Date(),
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
        scientific_name: symbolUpper,
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
          scraped_at: new Date(),
        },
      });
  }

  return res.json({
    found,
    cache_status: "miss",
    scraped_at: new Date(),
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/lady-bird-johnson/species-text"),
    provenance: { ...buildProvenance(req), matched_input: symbolUpper },
    ...(fetchError ? { fetch_error: fetchError } : {}),
    data: found
      ? {
          symbol: symbolUpper,
          url: profileUrl,
          sections,
          full_text: fullText,
        }
      : null,
  });
});

export default router;

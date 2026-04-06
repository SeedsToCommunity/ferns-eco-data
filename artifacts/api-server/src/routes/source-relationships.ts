import { Router, type IRouter } from "express";
import { ensureSourceRelationships, querySourceRelationships } from "../services/source-relationships/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();

const GENERAL_SUMMARY =
  "FERNS Source Relationships — canonical registry of cross-source overlaps, conflicts, and complementary pairings. " +
  "Each relationship record describes how two FERNS sources interact in a specific domain (taxonomy, occurrence counts, C-values, etc.) " +
  "and what actions, if any, an application must take when combining data from both.";

const TECHNICAL_DETAILS =
  "Source: internal source_relationships table. Seeded at startup from static definitions in the API server. " +
  "Relationships are stored with source_id_a < source_id_b (lexical order) and are queryable by either party. " +
  "Unique constraint on (source_id_a, source_id_b, scope) — one record per pair per domain. " +
  "Method: system (internal DB read, no upstream HTTP call).";

router.get("/v1/source-relationships", async (req, res) => {
  await ensureSourceRelationships();

  const sourceId = typeof req.query["source_id"] === "string" ? req.query["source_id"] : undefined;

  const rows = await querySourceRelationships(sourceId);

  res.json({
    source_url: resolveUrl(req, "/api/v1/source-relationships"),
    found: true,
    data: {
      relationship_count: rows.length,
      filtered_by_source_id: sourceId ?? null,
      relationships: rows,
    },
    provenance: {
      source_id: "ferns-registry",
      fetched_at: new Date(),
      method: "system",
      upstream_url: "internal:source_relationships",
      general_summary: GENERAL_SUMMARY,
      technical_details: TECHNICAL_DETAILS,
    },
  });
});

export default router;

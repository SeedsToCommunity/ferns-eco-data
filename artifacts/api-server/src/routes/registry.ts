import { Router, type IRouter } from "express";
import { db, fernsSourcesTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import { ensureBonapRegistryEntry } from "../services/bonap/seed.js";
import { ensureGbifRegistryEntry } from "../services/gbif/seed.js";
import { ensureLcscgRegistryEntry } from "../services/lcscg/seed.js";
import { ensureRegistryEntry } from "../services/registry/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();

const DERIVATION_SUMMARY =
  "FERNS Source Registry — live catalog of all registered FERNS Knowledge Services. " +
  "Reflects current registration state at time of request. Populated at service startup.";

const DERIVATION_SCIENTIFIC =
  "FERNS Knowledge Registry. Source: internal ferns_sources table. " +
  "Entries are written at service build time by each source's seed function. " +
  "The registry reads from this table without caching. " +
  "It does not perform taxonomy reconciliation, trust tier assignment, or cross-source synthesis — " +
  "those are application-layer concerns. " +
  "Method: system (internal DB read, no upstream HTTP call).";

async function seedAll(): Promise<void> {
  await Promise.all([
    ensureBonapRegistryEntry(),
    ensureGbifRegistryEntry(),
    ensureLcscgRegistryEntry(),
    ensureRegistryEntry(),
  ]);
}

const KNOWLEDGE_TYPE_ORDER: Record<string, number> = {
  source_wrapper: 0,
  derived_synthesis: 1,
  aggregation: 2,
  system: 3,
};

function sortSources(
  a: { knowledge_type: string; name: string },
  b: { knowledge_type: string; name: string },
): number {
  const aOrder = KNOWLEDGE_TYPE_ORDER[a.knowledge_type] ?? 99;
  const bOrder = KNOWLEDGE_TYPE_ORDER[b.knowledge_type] ?? 99;
  if (aOrder !== bOrder) return aOrder - bOrder;
  return a.name.localeCompare(b.name);
}

router.get("/v1/sources", async (req, res) => {
  await seedAll();

  const rows = await db
    .select()
    .from(fernsSourcesTable)
    .orderBy(asc(fernsSourcesTable.source_id));

  const sources = rows
    .map((r) => ({
      source_id: r.source_id,
      name: r.name,
      knowledge_type: r.knowledge_type,
      status: r.status,
      description: r.description ?? "",
      input_summary: r.input_summary ?? "",
      output_summary: r.output_summary ?? "",
      dependencies: r.dependencies ?? [],
      update_frequency: r.update_frequency ?? "",
      known_limitations: r.known_limitations ?? "",
      metadata_url: resolveUrl(req, r.metadata_url ?? ""),
      explorer_url: resolveUrl(req, r.explorer_url ?? ""),
    }))
    .sort(sortSources);

  res.json({
    source_url: resolveUrl(req, "/api/v1/sources"),
    found: true,
    data: { sources },
    provenance: {
      source_id: "ferns-registry",
      fetched_at: new Date(),
      method: "system",
      upstream_url: "internal:ferns_sources",
      derivation_summary: DERIVATION_SUMMARY,
      derivation_scientific: DERIVATION_SCIENTIFIC,
    },
  });
});

router.get("/v1/sources/metadata", async (req, res) => {
  const queriedAt = new Date();

  res.json({
    source_url: resolveUrl(req, "/api/v1/sources/metadata"),
    found: true,
    data: {
      source_id: "ferns-registry",
      name: "FERNS Source Registry",
      knowledge_type: "system",
      status: "live",
      description:
        "The discovery layer for the FERNS Data Layer. Lists all registered FERNS Knowledge Services with enough detail to make a routing decision. This is the starting point for any developer, researcher, or application that wants to know what FERNS knows.",
      input_summary: "No input required — the index returns all registered services",
      output_summary:
        "Array of SourceSummary objects, one per registered service, each with identity, description, input/output summary, dependencies, and links to full metadata and Source Explorer",
      dependencies: [],
      update_frequency: "Live — reflects registered services at time of request",
      known_limitations:
        "Reports what is registered; does not evaluate data quality, trust tier, or methodological soundness of registered services.",
      metadata_url: resolveUrl(req, "/api/v1/sources/metadata"),
      explorer_url: resolveUrl(req, "/"),
    },
    provenance: {
      source_id: "ferns-registry",
      fetched_at: queriedAt,
      method: "system",
      upstream_url: "internal:ferns_sources",
      derivation_summary: DERIVATION_SUMMARY,
      derivation_scientific: DERIVATION_SCIENTIFIC,
    },
  });
});

export default router;

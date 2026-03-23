import { Router, type IRouter } from "express";
import { db, registryEntriesTable } from "@workspace/db";
import { GetRegistryResponse } from "@workspace/api-zod";
import { ensureBonappRegistryEntry } from "../services/bonap/seed.js";

const router: IRouter = Router();

router.get("/registry", async (_req, res) => {
  await ensureBonappRegistryEntry();

  const entries = await db.select().from(registryEntriesTable).orderBy(registryEntriesTable.service_id);

  const payload = GetRegistryResponse.parse({
    source_url: null,
    found: true,
    data: entries.map((e) => ({
      service_id: e.service_id,
      service_name: e.service_name,
      knowledge_type: e.knowledge_type,
      input_summary: e.input_summary,
      output_summary: e.output_summary,
      data_lineage: e.data_lineage,
      update_frequency: e.update_frequency,
      geographic_scope: e.geographic_scope,
      taxonomic_scope: e.taxonomic_scope,
      permission_status: e.permission_status,
      known_limitations: e.known_limitations,
    })),
    provenance: {
      source_id: "ferns-registry",
      fetched_at: new Date(),
      method: "api_fetch",
      upstream_url: "/api/registry",
      derivation_summary:
        "FERNS service registry — lists all Knowledge Services configured in this FERNS instance.",
      derivation_scientific:
        "FERNS Knowledge Registry. Registry entries are populated at service startup and updated when new sources are integrated. Each entry conforms to the FERNS Knowledge Service Specification and includes input/output contracts, data lineage, permission status, and known limitations.",
    },
  });
  res.json(payload);
});

export default router;

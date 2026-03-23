import { db, registryEntriesTable } from "@workspace/db";
import { GBIF_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureGbifRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(registryEntriesTable)
      .values(GBIF_REGISTRY_ENTRY)
      .onConflictDoNothing({ target: registryEntriesTable.service_id });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed GBIF registry entry");
  }
}

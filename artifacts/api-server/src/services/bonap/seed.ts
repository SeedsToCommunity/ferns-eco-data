import { db, fernsSourcesTable } from "@workspace/db";
import { BONAP_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureBonapRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(BONAP_REGISTRY_ENTRY)
      .onConflictDoNothing({ target: fernsSourcesTable.source_id });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed BONAP registry entry");
  }
}

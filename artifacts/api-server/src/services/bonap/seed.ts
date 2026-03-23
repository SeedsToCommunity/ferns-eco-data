import { db, registryEntriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { BONAP_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureBonapRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(registryEntriesTable)
      .values(BONAP_REGISTRY_ENTRY)
      .onConflictDoNothing({ target: registryEntriesTable.service_id });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed BONAP registry entry");
  }
}

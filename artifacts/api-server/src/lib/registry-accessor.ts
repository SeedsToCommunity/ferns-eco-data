// DB-backed RegistryAccessor for buildEnvelope().
// Reads license, rights, and permission_granted from the ferns_sources table.
// Routes must call the source's ensureXxxRegistryEntry() before calling
// buildEnvelope() — this accessor throws if the source row is absent.

import { db, fernsSourcesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { RegistryAccessor, RegistryRecord } from "@workspace/api-envelope";

export const dbRegistryAccessor: RegistryAccessor = {
  async getSource(sourceId: string): Promise<RegistryRecord | null> {
    const [row] = await db
      .select({
        license: fernsSourcesTable.license,
        rights: fernsSourcesTable.rights,
        permission_granted: fernsSourcesTable.permission_granted,
      })
      .from(fernsSourcesTable)
      .where(eq(fernsSourcesTable.source_id, sourceId))
      .limit(1);

    if (!row) return null;
    return {
      license: row.license,
      rights: row.rights,
      permission_granted: row.permission_granted,
    };
  },
};

import { db, fernsSourcesTable, lcscgGuidesTable, lcscgSpeciesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { LCSCG_REGISTRY_ENTRY } from "./metadata.js";
import { LCSCG_GUIDES } from "./data/guides-data.js";
import { LCSCG_SPECIES } from "./data/species-data.js";
import { logger } from "../../lib/logger.js";

let registrySeeded = false;
let dataSeeded = false;

export async function ensureLcscgRegistryEntry(): Promise<void> {
  if (registrySeeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(LCSCG_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: LCSCG_REGISTRY_ENTRY.name,
          status: LCSCG_REGISTRY_ENTRY.status,
          description: LCSCG_REGISTRY_ENTRY.description,
          input_summary: LCSCG_REGISTRY_ENTRY.input_summary,
          output_summary: LCSCG_REGISTRY_ENTRY.output_summary,
          update_frequency: LCSCG_REGISTRY_ENTRY.update_frequency,
          known_limitations: LCSCG_REGISTRY_ENTRY.known_limitations,
          metadata_url: LCSCG_REGISTRY_ENTRY.metadata_url,
          explorer_url: LCSCG_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });

    registrySeeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed LCSCG registry entry");
  }
}

export async function seedLcscgData(): Promise<{ guidesUpserted: number; speciesUpserted: number }> {
  if (dataSeeded) {
    return { guidesUpserted: 0, speciesUpserted: 0 };
  }

  logger.info({ guides: LCSCG_GUIDES.length, species: LCSCG_SPECIES.length }, "Seeding LCSCG data from static files");

  for (const guide of LCSCG_GUIDES) {
    await db
      .insert(lcscgGuidesTable)
      .values(guide)
      .onConflictDoUpdate({
        target: lcscgGuidesTable.guide_id,
        set: {
          title: guide.title,
          subtitle: guide.subtitle,
          season: guide.season,
          habitat_type: guide.habitat_type,
          authors: guide.authors,
          license: guide.license,
          attribution_text: guide.attribution_text,
          harvest_notes: guide.harvest_notes,
          version: guide.version,
          field_museum_url: guide.field_museum_url,
          cloudinary_folder: guide.cloudinary_folder,
          status: guide.status,
        },
      });
  }

  logger.info({ count: LCSCG_GUIDES.length }, "LCSCG guides upserted");

  const BATCH_SIZE = 50;
  let speciesUpserted = 0;
  for (let i = 0; i < LCSCG_SPECIES.length; i += BATCH_SIZE) {
    const batch = LCSCG_SPECIES.slice(i, i + BATCH_SIZE);
    await db
      .insert(lcscgSpeciesTable)
      .values(batch)
      .onConflictDoUpdate({
        target: [lcscgSpeciesTable.guide_id, lcscgSpeciesTable.species_id],
        set: {
          scientific_name: sql`excluded.scientific_name`,
          common_name: sql`excluded.common_name`,
          family: sql`excluded.family`,
          photo_date: sql`excluded.photo_date`,
          description: sql`excluded.description`,
          seed_group_names: sql`excluded.seed_group_names`,
          seed_group_details: sql`excluded.seed_group_details`,
          image_filenames: sql`excluded.image_filenames`,
          image_urls: sql`excluded.image_urls`,
          page_number: sql`excluded.page_number`,
        },
      });
    speciesUpserted += batch.length;
  }

  logger.info({ count: speciesUpserted }, "LCSCG species upserted");
  dataSeeded = true;

  return { guidesUpserted: LCSCG_GUIDES.length, speciesUpserted };
}

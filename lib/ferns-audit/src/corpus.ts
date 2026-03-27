export interface TestSpecies {
  name: string;
  genus: string;
  species: string;
  label: string;
}

export interface TestPlace {
  id: number;
  name: string;
}

export const TEST_SPECIES: TestSpecies[] = [
  { name: "Quercus rubra", genus: "Quercus", species: "rubra", label: "Red oak" },
  { name: "Trillium grandiflorum", genus: "Trillium", species: "grandiflorum", label: "White trillium" },
  { name: "Asclepias tuberosa", genus: "Asclepias", species: "tuberosa", label: "Butterfly weed" },
];

export const TEST_PLACES: TestPlace[] = [
  { id: 10, name: "Michigan" },
  { id: 2423, name: "Washtenaw County, MI" },
];

export const FERNS_ENVELOPE_FIELDS = new Set([
  "found",
  "provenance",
  "source_url",
  "queried_at",
]);

export const KNOWN_FERNS_ADDITIONS = new Set([
  "cache_status",
  "matched_at",
  "fetched_at",
  "resolved_at",
  "matched_input",
  "source_url",
  "inat_url",
  "resolved_from_synonym_key",
  "synonyms_fetched_at",
  "vernacular_fetched_at",
  "occurrence_last_fetched",
  "species_stripped",
  "annotations_available",
  "peak_observation_month",
  "phenology_stages_available",
  "note",
  "queried_at",
  "accepted_usage_key",
  "accepted_canonical_name",
  "inat_taxon_id",
  "inat_name",
  "match_type",
  "default_photo_url",
  "preferred_common_name",
  "common_names",
  "wikipedia_summary",
]);

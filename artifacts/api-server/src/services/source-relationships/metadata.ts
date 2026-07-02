export type RelationshipType = "overlap" | "conflict" | "complements" | "supersedes";
export type RelationshipScope =
  | "taxonomy"
  | "occurrence_counts"
  | "c_values"
  | "conservation_ranks"
  | "geographic_coverage"
  | "terminology"
  | "seed_harvest"
  | "community_classification"
  | "occurrence"
  | "usda_symbol_resolution";
export type RelationshipSeverity = "blocking" | "cautionary" | "informational";

export interface SourceRelationshipSeed {
  source_id_a: string;
  source_id_b: string;
  relationship_type: RelationshipType;
  scope: RelationshipScope;
  severity: RelationshipSeverity;
  description: string;
  technical_note: string;
}

function pair(a: string, b: string): { source_id_a: string; source_id_b: string } {
  return a < b ? { source_id_a: a, source_id_b: b } : { source_id_a: b, source_id_b: a };
}

export const SOURCE_RELATIONSHIPS: SourceRelationshipSeed[] = [
  {
    ...pair("gbif", "inaturalist"),
    relationship_type: "overlap",
    scope: "occurrence_counts",
    severity: "blocking",
    description:
      "iNaturalist research-grade observations are published to GBIF. Occurrence counts from both services overlap and must not be double-counted. Treat as complementary views, not independent datasets.",
    technical_note:
      "iNaturalist records published to GBIF carry basisOfRecord=HUMAN_OBSERVATION. Filtering GBIF occurrences by basisOfRecord can partially isolate non-iNaturalist records, but the overlap is not perfectly separable without record-level deduplication by occurrenceID.",
  },
  {
    ...pair("bonap-napa", "gbif"),
    relationship_type: "overlap",
    scope: "taxonomy",
    severity: "cautionary",
    description:
      "Both draw from overlapping North American plant taxonomic sources. Name agreement between them is not independent corroboration of plant identity.",
    technical_note:
      "BONAP follows the Kartesz BONAP 2015 checklist; GBIF uses its own Backbone Taxonomy assembled from 105 source checklists including the Catalogue of Life. Both lean on WCVP for vascular plants but may differ on accepted names for contested taxa.",
  },
  {
    ...pair("gbif", "inaturalist"),
    relationship_type: "conflict",
    scope: "taxonomy",
    severity: "cautionary",
    description:
      "iNaturalist maintains its own taxonomic backbone independently of GBIF. Name divergence between the two sources is expected for some taxa and does not indicate an error.",
    technical_note:
      "iNaturalist's taxonomy is community-curated and may accept or synonymize names differently than the GBIF Backbone. When the same species query returns different accepted names across the two sources, consult a third authority (USDA PLANTS or BONAP) to assess which treatment to follow.",
  },
  {
    ...pair("michigan-flora", "universal-fqa"),
    relationship_type: "overlap",
    scope: "c_values",
    severity: "cautionary",
    description:
      "Universal FQA database ID 50 (Reznicek et al. 2014) shares C-value assignments with Michigan Flora. Querying both returns consistent C-values for Michigan species; they are not independent validation of each other.",
    technical_note:
      "Both implement the same Reznicek 2014 coefficient list. Differences may arise if either source has been corrected since the original publication. Do not treat agreement between them as confirmation from a second source.",
  },
  {
    ...pair("gbif", "natureserve"),
    relationship_type: "conflict",
    scope: "conservation_ranks",
    severity: "cautionary",
    description:
      "GBIF surfaces IUCN Red List categories through its taxonomic backbone. NatureServe provides independently assessed G/N/S element-based ranks. These measure different things and should not be treated as equivalent or used interchangeably.",
    technical_note:
      "GBIF IUCN categories reflect global threat status assessed by IUCN. NatureServe G/N/S ranks reflect rarity and vulnerability assessed element-by-element for the Americas. A species may be Least Concern (IUCN) but S1 (critically imperiled) in a specific state.",
  },
  {
    ...pair("inaturalist", "natureserve"),
    relationship_type: "conflict",
    scope: "conservation_ranks",
    severity: "cautionary",
    description:
      "iNaturalist's conservation_status field sources from third-party IUCN data and may lag NatureServe reassessments. Use NatureServe for authoritative conservation ranks within FERNS.",
    technical_note:
      "iNaturalist conservation_status is populated from external conservation status lists that are not updated on a fixed schedule. The field reflects IUCN categories, not NatureServe G/N/S ranks.",
  },
  {
    ...pair("mnfi", "natureserve"),
    relationship_type: "complements",
    scope: "community_classification",
    severity: "informational",
    description:
      "MNFI community types align with NatureServe ecological systems at national scale. NatureServe provides Americas-scale conservation context; MNFI provides Michigan field-level detail, characteristic plant lists, and county distribution maps not in NatureServe.",
    technical_note:
      "MNFI community type codes map onto NatureServe Ecological System codes. Combining both sources gives the fullest picture: NatureServe for national/continental classification context, MNFI for Michigan field-level community descriptions and element occurrence records.",
  },
  {
    ...pair("bonap-napa", "michigan-flora"),
    relationship_type: "complements",
    scope: "geographic_coverage",
    severity: "informational",
    description:
      "Both cover plant distribution. BONAP covers all of North America north of Mexico at county and state level (2014 baseline); Michigan Flora covers Michigan only at the county level with botanical descriptions and nativity context BONAP does not provide.",
    technical_note:
      "BONAP does not include botanical descriptions or nativity classifications for Michigan. Michigan Flora does not cover species outside Michigan. For a Michigan species, Michigan Flora is preferred for local detail; BONAP is the only option for out-of-state distribution context.",
  },
  {
    ...pair("inaturalist", "michigan-flora"),
    relationship_type: "complements",
    scope: "geographic_coverage",
    severity: "informational",
    description:
      "Michigan Flora provides county-level distribution from herbarium specimens (vetted, static as of 2011). iNaturalist provides continuously updated citizen science observations. Both cover Michigan species from different methodologies and time horizons.",
    technical_note:
      "Michigan Flora data reflects Voss & Reznicek 2012 and is not updated. iNaturalist data is live but unvetted at the individual record level (research-grade requires community ID agreement). Neither supersedes the other.",
  },
  {
    ...pair("bonap-napa", "inaturalist"),
    relationship_type: "complements",
    scope: "occurrence",
    severity: "informational",
    description:
      "BONAP provides vetted historical distribution from herbarium specimens (2014 baseline). iNaturalist provides continuously updated citizen science observations. Both cover occurrence but represent different methodologies and should be treated as complementary, not redundant.",
    technical_note:
      "BONAP maps are static (2014) and derived from curated herbarium collections. iNaturalist is live and crowd-sourced. Presence in BONAP but absence in iNaturalist (or vice versa) is expected and does not indicate an error in either source.",
  },
  {
    ...pair("gbif", "lcscg"),
    relationship_type: "conflict",
    scope: "taxonomy",
    severity: "cautionary",
    description:
      "LCSCG species names follow Flora of the Chicago Region (Wilhelm & Rericha 2017), which may differ from the GBIF Backbone Taxonomy. Name agreement between them is not guaranteed.",
    technical_note:
      "The Flora of the Chicago Region uses a conservative taxonomic treatment that accepts some names GBIF synonymizes, and vice versa. Always verify LCSCG names against GBIF before assuming taxonomic concordance.",
  },
  {
    ...pair("bonap-napa", "michigan-flora"),
    relationship_type: "conflict",
    scope: "terminology",
    severity: "cautionary",
    description:
      "BONAP uses \"adventive\" to mean a species native to North America but introduced to a specific state. Michigan Flora uses \"adventive\" to mean introduced from outside North America entirely. The same word has opposite geographic scopes in these two sources.",
    technical_note:
      "In BONAP, an adventive species in Michigan is North American native but non-native to Michigan (e.g., a Great Plains species spreading eastward). In Michigan Flora, \"adventive\" means introduced from outside North America (i.e., a European or Asian import). Never conflate the two without source-level disambiguation.",
  },
  {
    ...pair("bonap-napa", "mnfi"),
    relationship_type: "conflict",
    scope: "terminology",
    severity: "cautionary",
    description:
      "BONAP uses \"adventive\" to mean a species native to North America but introduced to a specific state. MNFI uses \"adventive\" to mean introduced from outside North America entirely. Same word, different geographic scope.",
    technical_note:
      "MNFI's nativity classifications align with Michigan Flora, not BONAP. See also the BONAP ↔ Michigan Flora terminology conflict. Any workflow combining BONAP and MNFI nativity data must translate between the two definitions.",
  },
  {
    ...pair("lcscg", "seeds-to-community-washtenaw"),
    relationship_type: "complements",
    scope: "seed_harvest",
    severity: "informational",
    description:
      "Both provide seed collection guidance for Midwest native plants. LCSCG covers Lake County, Illinois; S2C covers Washtenaw County, Michigan. Species may overlap geographically between the two programs.",
    technical_note:
      "LCSCG and S2C are independent programs with different guide formats. LCSCG includes season and habitat photographs and dispersal category data; S2C tracks annual workshop availability and suitability flags. Neither references the other.",
  },
  {
    ...pair("gbif", "usda-plants"),
    relationship_type: "overlap",
    scope: "taxonomy",
    severity: "cautionary",
    description:
      "Both cover North American plant nomenclature from overlapping federal and international sources. USDA PLANTS is the federal nomenclatural authority; GBIF uses its own backbone. Name agreement is not independent corroboration.",
    technical_note:
      "USDA PLANTS follows NRCS taxonomy, which is based on ITIS. GBIF's backbone is assembled from multiple checklists. Both reference overlapping but not identical source checklists, so agreement is partially circular.",
  },
  {
    ...pair("michigan-flora", "mnfi"),
    relationship_type: "complements",
    scope: "geographic_coverage",
    severity: "informational",
    description:
      "Both cover Michigan species occurrence at county level. Michigan Flora covers all Michigan vascular plants; MNFI covers MNFI-tracked taxa, which include vascular plants, non-vascular plants, animals, and community types.",
    technical_note:
      "For Michigan vascular plants, Michigan Flora's county occurrence data is more complete than MNFI's (which tracks only species of conservation concern or significance). MNFI adds community-level context and includes non-vascular taxa and animals that Michigan Flora does not.",
  },
  {
    ...pair("lady-bird-johnson", "usda-plants"),
    relationship_type: "complements",
    scope: "usda_symbol_resolution",
    severity: "informational",
    description:
      "The Lady Bird Johnson Wildflower Center profile URL uses the USDA Plants symbol as the id_plant parameter. USDA PLANTS symbol lookup must precede any LBJ profile retrieval — the symbol cannot be derived from a scientific name without a USDA PLANTS lookup.",
    technical_note:
      "LBJ profile URL pattern: https://www.wildflower.org/plants/result.php?id_plant={SYMBOL}. The SYMBOL value is the USDA Plants accepted symbol (e.g. TRGI for Trillium grandiflorum). FERNS chains USDA PLANTS name-match → LBJ profile URL; this chain makes LBJ verification dependent on USDA PLANTS symbol resolution.",
  },
];

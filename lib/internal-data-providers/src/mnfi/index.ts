/**
 * MNFI Internal Data Provider
 *
 * Serves data from the Michigan Natural Features Inventory, scraped from
 * https://mnfi.anr.msu.edu and committed as TypeScript data files.
 *
 * Purity rules:
 * - No async functions — all lookups are synchronous (data is in-memory)
 * - No HTTP calls, no DB access, no side effects
 * - No caching, no module-level mutable state — indexes are const Maps
 * - No imports from @workspace/db, drizzle-orm, @workspace/api-envelope,
 *   @workspace/api-zod, or any artifacts/ package
 */

import { MNFI_COMMUNITIES } from "./data/communities.js";
import { MNFI_COMMUNITY_SECTIONS } from "./data/community-sections.js";
import { MNFI_COMMUNITY_PLANTS } from "./data/community-plants.js";
import { MNFI_COMMUNITY_RARE_SPECIES } from "./data/community-rare-species.js";
import { MNFI_COMMUNITY_SIMILAR } from "./data/community-similar.js";
import { MNFI_COMMUNITY_EXTRAS } from "./data/community-extras.js";
import { MNFI_RARE_SPECIES } from "./data/rare-species.js";
import { MNFI_COUNTY_SPECIES } from "./data/county-species.js";
import { MNFI_COUNTY_COMMUNITIES } from "./data/county-communities.js";

export { MNFI_SCRAPED_AT } from "./data/scraped-at.js";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SpeciesKind = "plant" | "animal";

export type RareKind = "plant" | "animal" | "aquatic_animal";
// Two DIFFERENT axes — do not conflate, do not join on them:
// SpeciesKind: the roster's taxonomic split (plants page vs animals page).
// RareKind: a community page's section grouping. "aquatic_animal" is a
// section label, not a taxon — a fish is SpeciesKind "animal" in the roster
// but appears under RareKind "aquatic_animal" in a community section.
// The join from community_rare_species -> rare_species is on elementId (or
// scientificName as fallback), NEVER on kind.

export interface CommunityStub {
  communityId: number;
  slug: string;
  name: string;
  communityClass: string;
  communityGroup: string;
  globalRank: string | null;
  stateRank: string | null;
}

export interface CommunitySection {
  sectionName: string;
  text: string;
  sortOrder: number;
}

export interface CharacteristicPlant {
  lifeForm: string;
  commonName: string;
  scientificNames: string[];
  sortOrder: number;
}

export interface CommunityRareSpecies {
  kind: RareKind;
  scientificName: string;
  commonName: string | null;
  status: string | null;
  elementId: number | null;
}

export interface SimilarCommunity {
  communityId: number;
  name: string;
}

export interface CommunityFull extends CommunityStub {
  sections: CommunitySection[];
  characteristicPlants: CharacteristicPlant[];
  rareSpecies: CommunityRareSpecies[];
  similarCommunities: SimilarCommunity[];
  placesToVisit: string[];
  literature: string[];
  photoUrl: string | null;
  countyMapUrl: string | null;
  ecoregionMapUrl: string | null;
  abstractPdfUrl: string | null;
  mnfiUrl: string;
}

export interface SpeciesRecord {
  elementId: number | null;
  scientificName: string;
  commonName: string | null;
  kind: SpeciesKind;
  category: string;
  federalStatus: string | null;
  stateStatus: string | null;
  globalRank: string | null;
  stateRank: string | null;
  speciesPageUrl: string | null;
}

export interface CountySpeciesOccurrence {
  elementId: number | null;
  scientificName: string;
  commonName: string | null;
  category: string;
  federalStatus: string | null;
  stateStatus: string | null;
  globalRank: string | null;
  stateRank: string | null;
  lastObsYear: number | null;
}

export interface CountyCommunityOccurrence {
  elementId: number | null;
  name: string;
  globalRank: string | null;
  stateRank: string | null;
  lastObsYear: number | null;
}

export interface CountyOccurrences {
  county: string;
  species: CountySpeciesOccurrence[];
  communities: CountyCommunityOccurrence[];
}

export interface CommunityFilter {
  communityClass?: string;
  group?: string;
  rank?: string;
  nameText?: string;
}

export interface SpeciesFilter {
  nameText?: string;
  kind?: SpeciesKind;
  status?: string;
  rank?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface SpeciesPage {
  items: SpeciesRecord[];
  total: number;
  limit: number;
  offset: number;
}

export interface CountyFilter {
  kind?: SpeciesKind;
  status?: string;
  category?: string;
}

// ── Michigan counties — canonical 83-county list ──────────────────────────────
// Static authoritative list rather than derived from county species data.
// The county feed may be partial in a future scrape; this list never changes.
export const MICHIGAN_COUNTIES: ReadonlyArray<string> = [
  "Alcona", "Alger", "Allegan", "Alpena", "Antrim", "Arenac",
  "Baraga", "Barry", "Bay", "Benzie", "Berrien", "Branch",
  "Calhoun", "Cass", "Charlevoix", "Cheboygan", "Chippewa", "Clare", "Clinton", "Crawford",
  "Delta", "Dickinson", "Eaton", "Emmet", "Genesee", "Gladwin", "Gogebic",
  "Grand Traverse", "Gratiot", "Hillsdale", "Houghton", "Huron",
  "Ingham", "Ionia", "Iosco", "Iron", "Isabella",
  "Jackson", "Kalamazoo", "Kalkaska", "Kent", "Keweenaw",
  "Lake", "Lapeer", "Leelanau", "Lenawee", "Livingston", "Luce",
  "Mackinac", "Macomb", "Manistee", "Marquette", "Mason", "Mecosta",
  "Menominee", "Midland", "Missaukee", "Monroe", "Montcalm", "Montmorency",
  "Muskegon", "Newaygo", "Oakland", "Oceana", "Ogemaw", "Ontonagon",
  "Osceola", "Oscoda", "Otsego", "Ottawa",
  "Presque Isle", "Roscommon", "Saginaw", "Sanilac", "Schoolcraft",
  "Shiawassee", "St. Clair", "St. Joseph", "Tuscola", "Van Buren",
  "Washtenaw", "Wayne", "Wexford",
] as const;

// ── Eagerly computed indexes (built once at module load, never mutated) ────────

const communityBySlug: ReadonlyMap<string, CommunityStub> = new Map(
  MNFI_COMMUNITIES.map((c) => [c.slug.toLowerCase(), c as CommunityStub]),
);

const communityById: ReadonlyMap<number, CommunityStub> = new Map(
  MNFI_COMMUNITIES.map((c) => [c.communityId, c as CommunityStub]),
);

const sectionsById: ReadonlyMap<number, CommunitySection[]> = new Map(
  MNFI_COMMUNITY_SECTIONS.map((e) => [e.communityId, e.sections as CommunitySection[]]),
);

const plantsById: ReadonlyMap<number, CharacteristicPlant[]> = new Map(
  MNFI_COMMUNITY_PLANTS.map((e) => [e.communityId, e.plants as CharacteristicPlant[]]),
);

const rareSpeciesById: ReadonlyMap<number, CommunityRareSpecies[]> = new Map(
  MNFI_COMMUNITY_RARE_SPECIES.map((e) => [e.communityId, e.rareSpecies as CommunityRareSpecies[]]),
);

const similarById: ReadonlyMap<number, SimilarCommunity[]> = new Map(
  MNFI_COMMUNITY_SIMILAR.map((e) => [e.communityId, e.similar as SimilarCommunity[]]),
);

const extrasById: ReadonlyMap<number, typeof MNFI_COMMUNITY_EXTRAS[number]> = new Map(
  MNFI_COMMUNITY_EXTRAS.map((e) => [e.communityId, e]),
);

const speciesByElementId: ReadonlyMap<number, SpeciesRecord> = new Map(
  MNFI_RARE_SPECIES
    .filter((s) => s.elementId !== null)
    .map((s) => [s.elementId as number, s as SpeciesRecord]),
);

const speciesByName: ReadonlyMap<string, SpeciesRecord> = new Map(
  MNFI_RARE_SPECIES.map((s) => [s.scientificName.toLowerCase(), s as SpeciesRecord]),
);

const countySpeciesIndex: ReadonlyMap<string, Array<typeof MNFI_COUNTY_SPECIES[number]>> =
  MNFI_COUNTY_SPECIES.reduce((m, r) => {
    const key = r.county.toLowerCase();
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(r);
    return m;
  }, new Map<string, Array<typeof MNFI_COUNTY_SPECIES[number]>>());

const countyCommunitiesIndex: ReadonlyMap<string, Array<typeof MNFI_COUNTY_COMMUNITIES[number]>> =
  MNFI_COUNTY_COMMUNITIES.reduce((m, r) => {
    const key = r.county.toLowerCase();
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(r);
    return m;
  }, new Map<string, Array<typeof MNFI_COUNTY_COMMUNITIES[number]>>());

// communityId[] keyed by elementId — species → which communities list it
const rareSpeciesElementIdToCommunities: ReadonlyMap<number, number[]> =
  MNFI_COMMUNITY_RARE_SPECIES.reduce((m, e) => {
    for (const rs of e.rareSpecies) {
      if (rs.elementId !== null) {
        if (!m.has(rs.elementId)) m.set(rs.elementId, []);
        m.get(rs.elementId)!.push(e.communityId);
      }
    }
    return m;
  }, new Map<number, number[]>());

// communityId[] keyed by lowercased scientificName — fallback when elementId is null
const rareSpeciesNameToCommunities: ReadonlyMap<string, number[]> =
  MNFI_COMMUNITY_RARE_SPECIES.reduce((m, e) => {
    for (const rs of e.rareSpecies) {
      const key = rs.scientificName.toLowerCase();
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(e.communityId);
    }
    return m;
  }, new Map<string, number[]>());

// county[] keyed by elementId — species → which counties have a record
const countySpeciesElementIdToCounties: ReadonlyMap<number, string[]> =
  MNFI_COUNTY_SPECIES.reduce((m, r) => {
    if (r.elementId !== null) {
      if (!m.has(r.elementId)) m.set(r.elementId, []);
      const arr = m.get(r.elementId)!;
      if (!arr.includes(r.county)) arr.push(r.county);
    }
    return m;
  }, new Map<number, string[]>());

// county[] keyed by lowercased scientificName — fallback when elementId is null
const countySpeciesNameToCounties: ReadonlyMap<string, string[]> =
  MNFI_COUNTY_SPECIES.reduce((m, r) => {
    const key = r.scientificName.toLowerCase();
    if (!m.has(key)) m.set(key, []);
    const arr = m.get(key)!;
    if (!arr.includes(r.county)) arr.push(r.county);
    return m;
  }, new Map<string, string[]>());

// ── Internal helpers ──────────────────────────────────────────────────────────

function resolveSpecies(nameOrId: string | number): SpeciesRecord | null {
  if (typeof nameOrId === "number") {
    return speciesByElementId.get(nameOrId) ?? null;
  }
  return speciesByName.get(nameOrId.toLowerCase()) ?? null;
}

// ── Exported functions ────────────────────────────────────────────────────────

/**
 * GET /api/mnfi/communities — collection
 * Returns all community stubs, optionally filtered.
 */
export function getMnfiCommunityList(filter?: CommunityFilter): CommunityStub[] {
  let results = MNFI_COMMUNITIES as CommunityStub[];

  if (!filter) return results;

  if (filter.communityClass) {
    const cls = filter.communityClass.toLowerCase();
    results = results.filter((c) => c.communityClass.toLowerCase().includes(cls));
  }
  if (filter.group) {
    const grp = filter.group.toLowerCase();
    results = results.filter((c) => c.communityGroup.toLowerCase().includes(grp));
  }
  if (filter.rank) {
    const rank = filter.rank.toLowerCase();
    results = results.filter(
      (c) =>
        (c.globalRank?.toLowerCase() === rank) ||
        (c.stateRank?.toLowerCase() === rank),
    );
  }
  if (filter.nameText) {
    const text = filter.nameText.toLowerCase();
    results = results.filter((c) => c.name.toLowerCase().includes(text));
  }

  return results;
}

/**
 * GET /api/mnfi/communities/:slug — single lookup
 * Looks up a community by slug (case-insensitive) and returns the full record.
 */
export function getMnfiCommunity(slug: string): CommunityFull | null {
  const stub = communityBySlug.get(slug.toLowerCase());
  if (!stub) return null;

  const id = stub.communityId;
  const sections = sectionsById.get(id) ?? [];
  const plants = plantsById.get(id) ?? [];
  const rareSpecies = rareSpeciesById.get(id) ?? [];
  const similar = similarById.get(id) ?? [];
  const extras = extrasById.get(id);

  return {
    ...stub,
    sections,
    characteristicPlants: plants,
    rareSpecies,
    similarCommunities: similar,
    placesToVisit: extras?.placesToVisit ?? [],
    literature: extras?.literature ?? [],
    photoUrl: extras?.photoUrl ?? null,
    countyMapUrl: extras?.countyMapUrl ?? null,
    ecoregionMapUrl: extras?.ecoregionMapUrl ?? null,
    abstractPdfUrl: extras?.abstractPdfUrl ?? null,
    mnfiUrl: extras?.mnfiUrl ?? `https://mnfi.anr.msu.edu/communities/description/${id}/${stub.slug}`,
  };
}

/**
 * GET /api/mnfi/species — paginated collection
 * Unfiltered call returns first page only (limit defaults to 50).
 * Never dumps all records without a filter.
 */
export function getMnfiSpeciesList(filter?: SpeciesFilter): SpeciesPage {
  const limit = filter?.limit ?? 50;
  const offset = filter?.offset ?? 0;

  let results = MNFI_RARE_SPECIES as SpeciesRecord[];

  if (filter?.nameText) {
    const text = filter.nameText.toLowerCase();
    results = results.filter(
      (s) =>
        s.scientificName.toLowerCase().includes(text) ||
        (s.commonName?.toLowerCase().includes(text) ?? false),
    );
  }
  if (filter?.kind) {
    results = results.filter((s) => s.kind === filter.kind);
  }
  if (filter?.status) {
    const status = filter.status.toLowerCase();
    results = results.filter(
      (s) =>
        (s.federalStatus?.toLowerCase() === status) ||
        (s.stateStatus?.toLowerCase() === status),
    );
  }
  if (filter?.rank) {
    const rank = filter.rank.toLowerCase();
    results = results.filter(
      (s) =>
        (s.globalRank?.toLowerCase() === rank) ||
        (s.stateRank?.toLowerCase() === rank),
    );
  }
  if (filter?.category) {
    const cat = filter.category.toLowerCase();
    results = results.filter((s) => s.category.toLowerCase().includes(cat));
  }

  const total = results.length;
  const items = results.slice(offset, offset + limit);

  return { items, total, limit, offset };
}

/**
 * GET /api/mnfi/species/:name — single lookup
 * Accepts scientific name (string) or elementId (number).
 * Scientific name: case-insensitive exact match.
 * elementId: exact match (only if elementId is non-null).
 */
export function getMnfiSpecies(nameOrId: string | number): SpeciesRecord | null {
  return resolveSpecies(nameOrId);
}

/**
 * GET /api/mnfi/species/:name/communities — sub-resource
 * Communities whose rare-species lists include this species.
 * Join is on elementId (primary) or scientificName (fallback).
 */
export function getMnfiSpeciesCommunities(nameOrId: string | number): CommunityStub[] {
  const species = resolveSpecies(nameOrId);

  let communityIds: number[] = [];

  if (species?.elementId !== null && species?.elementId !== undefined) {
    communityIds = rareSpeciesElementIdToCommunities.get(species.elementId) ?? [];
  }

  // Fallback: join by scientificName when elementId is null or not found
  if (communityIds.length === 0) {
    const name = typeof nameOrId === "string" ? nameOrId : species?.scientificName ?? "";
    communityIds = rareSpeciesNameToCommunities.get(name.toLowerCase()) ?? [];
  }

  const seen = new Set<number>();
  const result: CommunityStub[] = [];
  for (const id of communityIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const stub = communityById.get(id);
    if (stub) result.push(stub);
  }
  return result;
}

/**
 * GET /api/mnfi/species/:name/counties — sub-resource
 * Michigan counties where this species has been recorded (county feed).
 * Returns county names only.
 */
export function getMnfiSpeciesCounties(nameOrId: string | number): string[] {
  const species = resolveSpecies(nameOrId);

  let counties: string[] = [];

  if (species?.elementId !== null && species?.elementId !== undefined) {
    counties = countySpeciesElementIdToCounties.get(species.elementId) ?? [];
  }

  // Fallback by name
  if (counties.length === 0) {
    const name = typeof nameOrId === "string" ? nameOrId : species?.scientificName ?? "";
    counties = countySpeciesNameToCounties.get(name.toLowerCase()) ?? [];
  }

  return counties;
}

/**
 * GET /api/mnfi/counties — collection (canonical 83-county list)
 * Returns the authoritative static list of Michigan counties.
 * Not derived from county species data so it is stable even if a scrape is partial.
 */
export function getMnfiCountyList(): string[] {
  return MICHIGAN_COUNTIES.slice();
}

/**
 * GET /api/mnfi/counties/:county — single lookup with optional filter
 * county: exact county name (case-insensitive).
 */
export function getMnfiCounty(county: string, filter?: CountyFilter): CountyOccurrences {
  const key = county.toLowerCase();

  let speciesRows = countySpeciesIndex.get(key) ?? [];
  let communityRows = countyCommunitiesIndex.get(key) ?? [];

  if (filter?.kind) {
    // County species feed does not have a kind field directly; join via elementId
    // to the roster to get kind.
    speciesRows = speciesRows.filter((r) => {
      const match = r.elementId !== null
        ? speciesByElementId.get(r.elementId)
        : speciesByName.get(r.scientificName.toLowerCase());
      return match?.kind === filter.kind;
    });
  }
  if (filter?.status) {
    const status = filter.status.toLowerCase();
    speciesRows = speciesRows.filter(
      (r) =>
        (r.federalStatus?.toLowerCase() === status) ||
        (r.stateStatus?.toLowerCase() === status),
    );
  }
  if (filter?.category) {
    const cat = filter.category.toLowerCase();
    speciesRows = speciesRows.filter((r) => r.category.toLowerCase().includes(cat));
  }

  const speciesOccurrences: CountySpeciesOccurrence[] = speciesRows.map((r) => ({
    elementId: r.elementId,
    scientificName: r.scientificName,
    commonName: r.commonName,
    category: r.category,
    federalStatus: r.federalStatus,
    stateStatus: r.stateStatus,
    globalRank: r.globalRank,
    stateRank: r.stateRank,
    lastObsYear: r.lastObsYear,
  }));

  const communityOccurrences: CountyCommunityOccurrence[] = communityRows.map((r) => ({
    elementId: r.elementId,
    name: r.name,
    globalRank: r.globalRank,
    stateRank: r.stateRank,
    lastObsYear: r.lastObsYear,
  }));

  // Normalize county name from actual data (preserve original casing)
  const actualCounty = speciesRows[0]?.county ?? communityRows[0]?.county ?? county;

  return {
    county: actualCounty,
    species: speciesOccurrences,
    communities: communityOccurrences,
  };
}

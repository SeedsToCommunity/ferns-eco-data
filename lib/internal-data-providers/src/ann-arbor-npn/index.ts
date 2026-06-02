export type { AnnArborNpnSpeciesEntry, AnnArborNpnImage } from "./data.js";
import {
  type AnnArborNpnSpeciesEntry,
  ANN_ARBOR_NPN_DATA,
  ANN_ARBOR_NPN_SNAPSHOT_DATE,
  lookupByAlias,
  ALIAS_INDEX,
} from "./data.js";

export { ANN_ARBOR_NPN_SNAPSHOT_DATE };

export function getAnnArborNpnSpecies(key: string): AnnArborNpnSpeciesEntry | undefined {
  return lookupByAlias(key);
}

export function listAnnArborNpnSpecies(): AnnArborNpnSpeciesEntry[] {
  return ANN_ARBOR_NPN_DATA;
}

export function listAnnArborNpnNameGroups(): Array<{
  acronym: string;
  latin_name: string;
  latin_synonym_greg: string | null;
  common_names: string[];
  all_accepted_keys: string[];
}> {
  return ANN_ARBOR_NPN_DATA.map((sp) => {
    const common_names = sp.common_name
      .split(/[;,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const all_accepted_keys: string[] = [];
    for (const [alias, acronym] of ALIAS_INDEX) {
      if (acronym === sp.acronym) {
        all_accepted_keys.push(alias);
      }
    }
    return {
      acronym: sp.acronym,
      latin_name: sp.latin_name,
      latin_synonym_greg: sp.latin_synonym_greg ?? null,
      common_names,
      all_accepted_keys,
    };
  });
}

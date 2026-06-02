export type { AnnArborNpnSpeciesEntry, AnnArborNpnImage } from "./data.js";
import { type AnnArborNpnSpeciesEntry, ANN_ARBOR_NPN_SNAPSHOT_DATE } from "./data.js";
export { ANN_ARBOR_NPN_SNAPSHOT_DATE };
export declare function getAnnArborNpnSpecies(key: string): AnnArborNpnSpeciesEntry | undefined;
export declare function listAnnArborNpnSpecies(): AnnArborNpnSpeciesEntry[];
export declare function listAnnArborNpnNameGroups(): Array<{
    acronym: string;
    latin_name: string;
    latin_synonym_greg: string | null;
    common_names: string[];
    all_accepted_keys: string[];
}>;
//# sourceMappingURL=index.d.ts.map
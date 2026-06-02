export interface AnnArborNpnImage {
    position: number;
    url: string;
    caption: string;
    kind: "photograph" | "drawing";
}
export interface AnnArborNpnSpeciesEntry {
    acronym: string;
    latin_name: string;
    latin_synonym_greg: string | null;
    common_name: string;
    light: string | null;
    moisture: string | null;
    height: string | null;
    flowering_time: string | null;
    flower_color: string | null;
    physiography: string | null;
    habitat: string | null;
    notes: string | null;
    range_michigan: string[] | null;
    npn_price_sizes: string | null;
    images: AnnArborNpnImage[];
    source_url: string;
}
export declare const ANN_ARBOR_NPN_SNAPSHOT_DATE = "2026-05-12";
export declare const ANN_ARBOR_NPN_DATA: AnnArborNpnSpeciesEntry[];
export declare const ALIAS_INDEX: Map<string, string>;
export declare function lookupByAlias(key: string): AnnArborNpnSpeciesEntry | undefined;
export declare function lookupByAcronym(acronym: string): AnnArborNpnSpeciesEntry | undefined;
//# sourceMappingURL=data.d.ts.map
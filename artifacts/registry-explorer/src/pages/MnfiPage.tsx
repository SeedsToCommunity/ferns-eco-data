import { useState, useMemo, useEffect } from "react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import {
  TreePine,
  ChevronDown,
  ChevronUp,
  Code,
  ExternalLink,
  Search,
  MapPin,
  Layers,
  AlertCircle,
  Leaf,
} from "lucide-react";

interface MnfiCommunity {
  community_id: number;
  slug: string;
  name: string;
  community_class: string;
  community_group: string;
  global_rank: string;
  state_rank: string;
  overview: string | null;
  landscape_context: string | null;
  soils_description: string | null;
  natural_processes: string | null;
  vegetation: string | null;
  management_notes: string | null;
  similar_communities: string[] | null;
  mnfi_url: string;
  county_map_url: string | null;
  description_fetched_at: string | null;
  imported_at: string;
}

interface PlantsByLifeForm {
  [lifeForm: string]: Array<{ common_name: string; scientific_names: string[] }>;
}

interface PlantData {
  total_entries: number;
  plants_imported: boolean;
  by_life_form: PlantsByLifeForm;
  plant_list_url: string;
}

interface MnfiCountyElement {
  id: number;
  county: string;
  element_name: string;
  element_type: string;
  scientific_name: string | null;
  common_name: string | null;
  federal_status: string | null;
  state_status: string | null;
  global_rank: string | null;
  state_rank: string | null;
  occurrences_in_county: number | null;
  last_observed: string | null;
}

function RawPanel({ title, data }: { title: string; data: unknown }) {
  const [open, setOpen] = useState(false);
  if (!data) return null;
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Code className="w-3.5 h-3.5" />
          {title}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border/50 p-3">
          <pre className="text-[10px] font-mono leading-relaxed bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg overflow-x-auto max-h-80 overflow-y-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function ExpandableText({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  const preview = text.slice(0, 200);
  const needsTruncation = text.length > 200;
  return (
    <div className="space-y-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between gap-2 group"
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
        {needsTruncation && (
          <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
            {open ? "show less" : "show more"}
          </span>
        )}
      </button>
      <p className="text-sm leading-relaxed text-foreground/90">
        {needsTruncation && !open ? `${preview}…` : text}
      </p>
    </div>
  );
}

function RankBadge({ rank, label }: { rank: string; label: string }) {
  const rankLevel = rank.replace(/[?]/g, "");
  const isImperiled = rankLevel.startsWith("G1") || rankLevel.startsWith("G2") || rankLevel.startsWith("S1") || rankLevel.startsWith("S2");
  const isVulnerable = rankLevel.startsWith("G3") || rankLevel.startsWith("S3");
  const isExtirpated = rankLevel.includes("SX") || rankLevel.includes("GX");
  const isUnranked = rankLevel === "GU" || rankLevel === "GNR" || rankLevel === "SU";

  const color = isExtirpated
    ? "bg-gray-900 text-gray-300 border-gray-700"
    : isImperiled
    ? "bg-red-950 text-red-300 border-red-800"
    : isVulnerable
    ? "bg-amber-950 text-amber-300 border-amber-800"
    : isUnranked
    ? "bg-zinc-800 text-zinc-400 border-zinc-600"
    : "bg-green-950 text-green-300 border-green-800";

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${color}`}>
      <span className="text-[9px] opacity-60">{label}</span>
      {rank}
    </span>
  );
}

const LIFE_FORM_ORDER = ["Trees", "Shrubs", "Graminoids", "Forbs", "Ferns", "Fern Allies", "Mosses", "Lichens", "Vines"];

const CLASS_ORDER = ["Palustrine", "Palustrine/Terrestrial", "Primary", "Subterranean/Sink", "Terrestrial"];
const CLASS_COLORS: Record<string, string> = {
  Palustrine: "text-blue-400",
  "Palustrine/Terrestrial": "text-teal-400",
  Primary: "text-orange-400",
  "Subterranean/Sink": "text-purple-400",
  Terrestrial: "text-green-400",
};

function PlantListPanel({ communityId, communitySlug }: { communityId: number; communitySlug: string }) {
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPlantData(null);
    setLoading(true);
    setError(null);
    setOpen(false);
    fetch(`../api/mnfi/communities/${communityId}/plants`)
      .then((r) => r.json())
      .then((d) => {
        setPlantData(d.data ?? null);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, [communityId, communitySlug]);

  if (loading) {
    return (
      <div className="border border-border/50 rounded-xl p-3 bg-muted/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
          <Leaf className="w-3.5 h-3.5" />
          Loading plant list…
        </div>
      </div>
    );
  }

  if (error || !plantData || !plantData.plants_imported) {
    return null;
  }

  const lifeFormKeys = Object.keys(plantData.by_life_form);
  const orderedForms = [
    ...LIFE_FORM_ORDER.filter((f) => lifeFormKeys.includes(f)),
    ...lifeFormKeys.filter((f) => !LIFE_FORM_ORDER.includes(f)),
  ];
  const totalSpecies = plantData.total_entries;

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-xs font-medium">
          <Leaf className="w-3.5 h-3.5 text-green-400" />
          <span>Characteristic Plants</span>
          <span className="text-muted-foreground">({totalSpecies} entries)</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground" />
        }
      </button>
      {open && (
        <div className="border-t border-border/50 p-3 space-y-4 max-h-96 overflow-y-auto">
          {orderedForms.map((form) => {
            const plants = plantData.by_life_form[form];
            return (
              <div key={form}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{form}</p>
                <ul className="space-y-1">
                  {plants.map((p, i) => (
                    <li key={i} className="text-xs leading-relaxed flex gap-1">
                      <span className="text-foreground/80">{p.common_name}</span>
                      {p.scientific_names.length > 0 && (
                        <span className="italic text-muted-foreground">
                          ({p.scientific_names.join(", ")})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <a
            href={plantData.plant_list_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View on MNFI
          </a>
        </div>
      )}
    </div>
  );
}

export default function MnfiPage() {
  const [communities, setCommunities] = useState<MnfiCommunity[] | null>(null);
  const [commLoading, setCommLoading] = useState(false);
  const [commError, setCommError] = useState<string | null>(null);
  const [commRaw, setCommRaw] = useState<unknown>(null);

  const [selected, setSelected] = useState<MnfiCommunity | null>(null);

  const [classFilter, setClassFilter] = useState<string>("");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");

  const [countyInput, setCountyInput] = useState("");
  const [countyData, setCountyData] = useState<unknown>(null);
  const [countyElements, setCountyElements] = useState<MnfiCountyElement[] | null>(null);
  const [countyLoading, setCountyLoading] = useState(false);
  const [countyError, setCountyError] = useState<string | null>(null);

  async function loadCommunities() {
    setCommLoading(true);
    setCommError(null);
    try {
      const res = await fetch("../api/mnfi/communities");
      const data = await res.json();
      setCommRaw(data);
      setCommunities(data.data?.communities ?? []);
    } catch (e) {
      setCommError(String(e));
    } finally {
      setCommLoading(false);
    }
  }

  async function lookupCounty() {
    if (!countyInput.trim()) return;
    setCountyLoading(true);
    setCountyError(null);
    setCountyElements(null);
    setCountyData(null);
    try {
      const res = await fetch(`../api/mnfi/county-elements?county=${encodeURIComponent(countyInput.trim())}`);
      const data = await res.json();
      setCountyData(data);
      setCountyElements(data.data?.elements ?? []);
      if (data.data?.elements?.length === 0 && data.data?.data_loaded === false) {
        setCountyError(data.data?.note ?? "No data available.");
      }
    } catch (e) {
      setCountyError(String(e));
    } finally {
      setCountyLoading(false);
    }
  }

  const allGroups = useMemo(() => {
    if (!communities) return [];
    const groups = new Set(communities.map((c) => c.community_group));
    return Array.from(groups).sort();
  }, [communities]);

  const filteredCommunities = useMemo(() => {
    if (!communities) return [];
    return communities.filter((c) => {
      if (classFilter && c.community_class !== classFilter) return false;
      if (groupFilter && c.community_group !== groupFilter) return false;
      if (nameFilter && !c.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
      return true;
    });
  }, [communities, classFilter, groupFilter, nameFilter]);

  const groupedCommunities = useMemo(() => {
    const map = new Map<string, Map<string, MnfiCommunity[]>>();
    for (const c of filteredCommunities) {
      if (!map.has(c.community_class)) map.set(c.community_class, new Map());
      const grpMap = map.get(c.community_class)!;
      if (!grpMap.has(c.community_group)) grpMap.set(c.community_group, []);
      grpMap.get(c.community_group)!.push(c);
    }
    return map;
  }, [filteredCommunities]);

  const sortedClasses = CLASS_ORDER.filter((cls) => groupedCommunities.has(cls));

  return (
    <SourceExplorerLayout sourceId="mnfi">
      <div className="space-y-8">

        {/* Community Browser */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              Natural Community Classification
            </h2>
            {!communities && (
              <button
                onClick={loadCommunities}
                disabled={commLoading}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {commLoading ? "Loading…" : "Load Communities"}
              </button>
            )}
          </div>

          {commError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {commError}
            </div>
          )}

          {communities && (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-40">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name…"
                    value={nameFilter}
                    onChange={(e) => { setNameFilter(e.target.value); setSelected(null); }}
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted/40 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <select
                  value={classFilter}
                  onChange={(e) => { setClassFilter(e.target.value); setGroupFilter(""); setSelected(null); }}
                  className="px-3 py-1.5 text-sm bg-muted/40 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">All classes</option>
                  {CLASS_ORDER.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <select
                  value={groupFilter}
                  onChange={(e) => { setGroupFilter(e.target.value); setSelected(null); }}
                  className="px-3 py-1.5 text-sm bg-muted/40 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">All groups</option>
                  {allGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {(classFilter || groupFilter || nameFilter) && (
                  <button
                    onClick={() => { setClassFilter(""); setGroupFilter(""); setNameFilter(""); }}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border/50 rounded-lg transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Showing {filteredCommunities.length} of {communities.length} communities
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Community List */}
                <div className="space-y-4">
                  {sortedClasses.map((cls) => {
                    const grpMap = groupedCommunities.get(cls)!;
                    const sortedGroups = Array.from(grpMap.keys()).sort();
                    return (
                      <div key={cls} className="space-y-2">
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${CLASS_COLORS[cls] ?? "text-muted-foreground"}`}>
                          {cls}
                        </h3>
                        {sortedGroups.map((grp) => {
                          const comms = grpMap.get(grp)!;
                          return (
                            <div key={grp} className="space-y-1">
                              <p className="text-[11px] font-medium text-muted-foreground pl-1">{grp}</p>
                              {comms.map((c) => (
                                <button
                                  key={c.community_id}
                                  onClick={() => setSelected(c === selected ? null : c)}
                                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-sm ${
                                    selected?.community_id === c.community_id
                                      ? "border-primary/50 bg-primary/5"
                                      : "border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border/60"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium">{c.name}</span>
                                    <div className="flex gap-1 shrink-0">
                                      <RankBadge rank={c.global_rank} label="G" />
                                      <RankBadge rank={c.state_rank} label="S" />
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {filteredCommunities.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">No communities match your filters.</div>
                  )}
                </div>

                {/* Detail Panel */}
                {selected && (
                  <div className="sticky top-4 space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
                    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xl font-bold">{selected.name}</h3>
                          <button
                            onClick={() => setSelected(null)}
                            className="text-muted-foreground hover:text-foreground text-lg leading-none shrink-0 mt-0.5"
                          >
                            ×
                          </button>
                        </div>
                        <p className={`text-xs font-medium ${CLASS_COLORS[selected.community_class] ?? "text-muted-foreground"}`}>
                          {selected.community_class} · {selected.community_group}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <RankBadge rank={selected.global_rank} label="Global" />
                        <RankBadge rank={selected.state_rank} label="State" />
                      </div>

                      {selected.overview && (
                        <ExpandableText label="Overview" text={selected.overview} />
                      )}

                      {selected.landscape_context && (
                        <ExpandableText label="Landscape Context" text={selected.landscape_context} />
                      )}

                      {selected.soils_description && (
                        <ExpandableText label="Soils" text={selected.soils_description} />
                      )}

                      {selected.natural_processes && (
                        <ExpandableText label="Natural Processes" text={selected.natural_processes} />
                      )}

                      {selected.vegetation && (
                        <ExpandableText label="Vegetation" text={selected.vegetation} />
                      )}

                      {selected.similar_communities && selected.similar_communities.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Similar Communities</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selected.similar_communities.map((name) => (
                              <button
                                key={name}
                                onClick={() => {
                                  const match = communities?.find(
                                    (c) => c.name.toLowerCase() === name.toLowerCase()
                                  );
                                  if (match) setSelected(match);
                                }}
                                className="px-2 py-0.5 text-xs rounded-full border border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-border/80 transition-colors cursor-pointer"
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selected.management_notes && (
                        <ExpandableText label="Management Notes" text={selected.management_notes} />
                      )}

                      {selected.county_map_url && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">County Distribution</p>
                          <img
                            src={selected.county_map_url}
                            alt={`County distribution map for ${selected.name}`}
                            className="w-full rounded-lg border border-border/40"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                      )}

                      <div className="pt-2 border-t border-border/40 flex gap-2">
                        <a
                          href={selected.mnfi_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-muted hover:bg-muted/70 transition-colors border border-border/50"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View on MNFI
                        </a>
                        <span className="text-xs text-muted-foreground self-center font-mono">ID: {selected.community_id}</span>
                      </div>
                    </div>

                    <PlantListPanel
                      communityId={selected.community_id}
                      communitySlug={selected.slug}
                    />

                    <RawPanel title="Raw JSON" data={selected} />
                  </div>
                )}
              </div>

              <RawPanel title="Full API Response" data={commRaw} />
            </>
          )}
        </div>

        {/* County Elements */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            County Element Data
          </h2>

          <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-200">Data availability note</p>
              <p className="text-sm text-amber-300/80">
                MNFI county element data (species and community occurrences per Michigan county) is served
                through a JavaScript-rendered web interface with no public bulk-download API. A data-sharing
                agreement is being pursued with MNFI to obtain direct access. Contact MNFI via their{" "}
                <a
                  href="https://mnfi.anr.msu.edu/services/special-data-requests"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-200"
                >
                  Special Data Requests program
                </a>{" "}
                for bulk county element data.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Michigan county name (e.g. Washtenaw)"
              value={countyInput}
              onChange={(e) => setCountyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupCounty()}
              className="flex-1 px-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={lookupCounty}
              disabled={countyLoading || !countyInput.trim()}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {countyLoading ? "Searching…" : "Search"}
            </button>
          </div>

          {countyError && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-sm text-muted-foreground">
              {countyError}
            </div>
          )}

          {countyElements && countyElements.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {countyElements.length} element{countyElements.length !== 1 ? "s" : ""} found in {countyInput}
              </p>
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Name</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Type</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">G Rank</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">S Rank</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Occurrences</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Last Obs.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countyElements.map((el) => (
                      <tr key={el.id} className="border-b border-border/30 hover:bg-muted/20">
                        <td className="px-3 py-2">
                          <p className="font-medium">{el.element_name}</p>
                          {el.scientific_name && <p className="text-xs italic text-muted-foreground">{el.scientific_name}</p>}
                        </td>
                        <td className="px-3 py-2 text-xs capitalize text-muted-foreground">{el.element_type}</td>
                        <td className="px-3 py-2 font-mono text-xs">{el.global_rank ?? "—"}</td>
                        <td className="px-3 py-2 font-mono text-xs">{el.state_rank ?? "—"}</td>
                        <td className="px-3 py-2 text-xs">{el.occurrences_in_county ?? "—"}</td>
                        <td className="px-3 py-2 text-xs">{el.last_observed ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <RawPanel title="Raw county element response" data={countyData} />
            </div>
          )}
        </div>
      </div>
    </SourceExplorerLayout>
  );
}

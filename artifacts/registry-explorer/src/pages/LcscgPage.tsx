import { useState, useMemo, useEffect } from "react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import { Leaf, ChevronDown, ChevronUp, Code, ExternalLink, Search, BookOpen, Image } from "lucide-react";

interface LcscgGuide {
  guide_id: number;
  title: string;
  subtitle: string;
  season: string;
  habitat_type: string;
  authors: string;
  license: string;
  attribution_text: string;
  harvest_notes: string;
  version: string;
  field_museum_url: string;
  cloudinary_folder: string;
  status: string;
  imported_at: string;
  species_count?: number;
}

interface SeedGroupDetail {
  name: string;
  description: string;
  images: string[];
}

interface LcscgSpeciesRecord {
  id: number;
  guide_id: number;
  species_id: string;
  scientific_name: string;
  common_name: string;
  family: string;
  photo_date: string;
  description: string;
  seed_group_names: string[];
  seed_group_details: SeedGroupDetail[];
  image_filenames: string[];
  image_urls: string[];
  page_number: number;
  imported_at: string;
  guide_title?: string;
  guide_season?: string;
  guide_habitat_type?: string;
  guide_cloudinary_folder?: string;
}

interface GuideWithSpecies {
  guide: LcscgGuide;
  species_count: number;
  species: LcscgSpeciesRecord[];
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
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
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

function SpeciesCard({ record }: { record: LcscgSpeciesRecord }) {
  const [open, setOpen] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between p-3 hover:bg-muted/30 transition-colors text-left gap-3"
      >
        <div className="min-w-0">
          <div className="font-medium italic text-sm text-foreground truncate">{record.scientific_name}</div>
          <div className="text-xs text-muted-foreground truncate">{record.common_name}</div>
          {record.seed_group_names.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {record.seed_group_names.map((g) => (
                <span key={g} className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2 pt-0.5">
          {record.image_urls.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Image className="w-3 h-3" />
              {record.image_urls.length}
            </div>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border p-3 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Family: </span>
              <span className="font-medium">{record.family || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Photo date: </span>
              <span className="font-medium">{record.photo_date || "—"}</span>
            </div>
            {record.guide_title && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Guide: </span>
                <span className="font-medium">{record.guide_title}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Page: </span>
              <span className="font-medium">{record.page_number || "—"}</span>
            </div>
          </div>

          {record.description && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Harvest Notes</div>
              <p className="text-xs text-foreground leading-relaxed">{record.description}</p>
            </div>
          )}

          {record.seed_group_details.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Seed Groups</div>
              <div className="space-y-1.5">
                {record.seed_group_details.map((g) => (
                  <div key={g.name} className="bg-muted/30 rounded-lg p-2">
                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">{g.name}</div>
                    <p className="text-xs text-foreground leading-relaxed">{g.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {record.image_urls.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Images ({record.image_urls.length})
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={record.image_urls[imgIdx]}
                  alt={`${record.scientific_name} — photo ${imgIdx + 1}`}
                  className="w-28 h-28 object-cover rounded-lg border border-border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="flex flex-col gap-1">
                  {record.image_urls.length > 1 && (
                    <div className="flex gap-1 flex-wrap">
                      {record.image_urls.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"}`}
                        />
                      ))}
                    </div>
                  )}
                  <a
                    href={record.image_urls[imgIdx]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-2.5 h-2.5" /> Open image
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const SEASON_LABELS: Record<string, string> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  all: "All Seasons",
};

const HABITAT_LABELS: Record<string, string> = {
  woodland: "Woodland",
  wetland: "Wetland",
  prairie: "Prairie",
  grasses_and_kin: "Grasses & Kin",
  asters_and_goldenrods: "Asters & Goldenrods",
  woody_plants: "Woody Plants",
};

export function LcscgPage() {
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [guidesData, setGuidesData] = useState<{ guides: LcscgGuide[]; guide_count: number } | null>(null);
  const [guideDetail, setGuideDetail] = useState<GuideWithSpecies | null>(null);
  const [searchResults, setSearchResults] = useState<{ records: LcscgSpeciesRecord[]; result_count: number; queried_name: string } | null>(null);
  const [mode, setMode] = useState<"guides" | "search">("guides");
  const [loading, setLoading] = useState(false);
  const [rawGuides, setRawGuides] = useState<Record<string, unknown> | null>(null);
  const [rawGuide, setRawGuide] = useState<Record<string, unknown> | null>(null);
  const [rawSearch, setRawSearch] = useState<Record<string, unknown> | null>(null);

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  async function loadGuides() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/lcscg/guides`);
      const json = await res.json();
      setRawGuides(json);
      setGuidesData(json.data ?? null);
    } finally {
      setLoading(false);
    }
  }

  async function loadGuide(guideId: number) {
    setLoading(true);
    setSelectedGuideId(guideId);
    try {
      const res = await fetch(`${apiBase}/api/lcscg/guide/${guideId}`);
      const json = await res.json();
      setRawGuide(json);
      setGuideDetail(json.data ?? null);
    } finally {
      setLoading(false);
    }
  }

  async function runSearch() {
    if (!searchName.trim()) return;
    const q = searchName.trim();
    setSearchQuery(q);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/lcscg/species?name=${encodeURIComponent(q)}`);
      const json = await res.json();
      setRawSearch(json);
      setSearchResults(json.data ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuides();
  }, []);

  const guides = guidesData?.guides ?? [];

  // Group guides by season → habitat for display
  const SEASON_ORDER = ["spring", "summer", "fall", "all"];
  const guidesBySeason = useMemo(() => {
    const grouped: Record<string, LcscgGuide[]> = {};
    for (const g of guides) {
      if (!grouped[g.season]) grouped[g.season] = [];
      grouped[g.season].push(g);
    }
    return SEASON_ORDER.filter((s) => grouped[s]).map((s) => ({ season: s, guides: grouped[s] }));
  }, [guides]);

  const filteredSpecies = useMemo(() => {
    const records = guideDetail?.species ?? [];
    if (!searchName.trim() || mode !== "guides") return records;
    const q = searchName.toLowerCase();
    return records.filter(
      (r) =>
        r.scientific_name.toLowerCase().includes(q) ||
        r.common_name.toLowerCase().includes(q),
    );
  }, [guideDetail, searchName, mode]);

  return (
    <SourceExplorerLayout sourceId="lcscg">
      <div className="space-y-6">

        <div className="flex gap-2">
          <button
            onClick={() => { setMode("guides"); setSearchResults(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
              mode === "guides"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Browse by Guide
          </button>
          <button
            onClick={() => setMode("search")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
              mode === "search"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/50"
            }`}
          >
            <Search className="w-4 h-4" />
            Search by Name
          </button>
        </div>

        {mode === "guides" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select a Guide ({guides.length} guides)
              </p>
              {guidesBySeason.map(({ season, guides: seasonGuides }) => (
                <div key={season} className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 pl-0.5">
                    {SEASON_LABELS[season] ?? season}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {seasonGuides.map((g) => (
                      <button
                        key={g.guide_id}
                        onClick={() => loadGuide(g.guide_id)}
                        className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                          selectedGuideId === g.guide_id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <div className="font-medium leading-tight">{g.title}</div>
                        <div className={`text-[11px] mt-0.5 flex gap-2 ${selectedGuideId === g.guide_id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          <span>{HABITAT_LABELS[g.habitat_type] ?? g.habitat_type}</span>
                          {g.species_count != null && (
                            <span>· {g.species_count} spp.</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading…
              </div>
            )}

            {!loading && guideDetail && (
              <div className="space-y-3">
                <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-foreground">{guideDetail.guide.title}</h2>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {SEASON_LABELS[guideDetail.guide.season] ?? guideDetail.guide.season} ·{" "}
                        {HABITAT_LABELS[guideDetail.guide.habitat_type] ?? guideDetail.guide.habitat_type} ·{" "}
                        {guideDetail.guide.authors}
                      </div>
                    </div>
                    <a
                      href={guideDetail.guide.field_museum_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Field Museum
                    </a>
                  </div>
                  {guideDetail.guide.harvest_notes && (
                    <p className="text-xs text-foreground leading-relaxed bg-muted/30 rounded-lg px-3 py-2">
                      {guideDetail.guide.harvest_notes}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {guideDetail.guide.license} · {guideDetail.species_count} species
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Filter species by name…"
                    className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredSpecies.length}</span> of {guideDetail.species_count} species
                </div>

                <div className="space-y-2">
                  {filteredSpecies.map((sp) => (
                    <SpeciesCard key={sp.id} record={sp} />
                  ))}
                </div>
              </div>
            )}

            <RawPanel title="Raw API response — /api/lcscg/guides" data={rawGuides} />
            {rawGuide && <RawPanel title={`Raw API response — /api/lcscg/guide/${selectedGuideId}`} data={rawGuide} />}
          </div>
        )}

        {mode === "search" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Search Across All Guides
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
                    placeholder="Scientific or common name…"
                    className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  onClick={runSearch}
                  disabled={!searchName.trim() || loading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Searching…
              </div>
            )}

            {!loading && searchResults && (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{searchResults.result_count}</span> records
                  {searchResults.queried_name ? ` matching "${searchResults.queried_name}"` : ""}
                </div>
                {searchResults.records.length === 0 && (
                  <p className="text-sm text-muted-foreground bg-card border border-border rounded-xl p-5">
                    No species found for "{searchResults.queried_name}".
                  </p>
                )}
                <div className="space-y-2">
                  {searchResults.records.map((sp) => (
                    <SpeciesCard key={`${sp.guide_id}-${sp.species_id}`} record={sp} />
                  ))}
                </div>
              </div>
            )}

            {rawSearch && <RawPanel title={`Raw API response — /api/lcscg/species?name=…`} data={rawSearch} />}
          </div>
        )}

      </div>
    </SourceExplorerLayout>
  );
}

export default LcscgPage;

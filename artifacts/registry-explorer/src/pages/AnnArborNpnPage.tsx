import { useState, useEffect, type FormEvent } from "react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import {
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Code,
  Image,
  Leaf,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = `${BASE_URL}/api`;

// ─── Michigan region legend ───────────────────────────────────────────────────
// Greg Vaclavek uses short abbreviations on nativeplant.com.
// This map translates them to plain English for UI display.
const MICHIGAN_RANGE_LEGEND: Record<string, string> = {
  SE: "Southeast Michigan",
  SW: "Southwest Michigan",
  NE: "Northeast Michigan (Lower Peninsula)",
  NW: "Northwest Michigan (Lower Peninsula)",
  NL: "Northern Lower Peninsula",
  UP: "Upper Peninsula",
  LP: "Lower Peninsula (statewide)",
  "S LP": "Southern Lower Peninsula",
  "N LP": "Northern Lower Peninsula",
  Statewide: "Statewide (all regions)",
  Ubiquitous: "Ubiquitous — found throughout Michigan",
};

function expandMichiganRegion(code: string): string {
  return MICHIGAN_RANGE_LEGEND[code] ?? MICHIGAN_RANGE_LEGEND[code.toUpperCase()] ?? code;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NpnImage {
  position: number;
  url: string;
  caption: string;
  kind: "photograph" | "drawing";
}

interface NpnSpecies {
  acronym: string;
  latin_name: string;
  latin_synonym_greg: string | null;
  common_name: string;
  light: string | null;
  moisture: string | null;
  height: string | null;
  flowering_time: string | null;
  habitat: string | null;
  notes: string | null;
  range_michigan: string[] | null;
  npn_price_sizes: string | null;
  images: NpnImage[];
  source_url: string;
  scraped_at: string;
}

interface Provenance {
  source_id?: string;
  fetched_at?: string;
  method?: string;
  upstream_url?: string;
  general_summary?: string;
  technical_details?: string;
  matched_input?: string;
  [key: string]: unknown;
}

interface SpeciesEnvelope {
  found: boolean;
  queried_at: string;
  source_url: string;
  provenance?: Provenance;
  data: NpnSpecies | null;
}

interface BulkEnvelope {
  found: boolean;
  queried_at: string;
  source_url: string;
  provenance?: Provenance;
  data: {
    species_count: number;
    species: NpnSpecies[];
  } | null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

/** Collapsible provenance panel showing source metadata for a response. */
function ProvenancePanel({ provenance }: { provenance: Provenance | undefined }) {
  const [open, setOpen] = useState(false);
  if (!provenance) return null;
  return (
    <div className="border border-amber-200 dark:border-amber-800/50 rounded-xl overflow-hidden bg-amber-50/40 dark:bg-amber-900/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-3 hover:bg-amber-50/70 dark:hover:bg-amber-900/20 transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
          <Info className="w-3.5 h-3.5" />
          Provenance — Ann Arbor Native Plant Nursery (nativeplant.com)
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        )}
      </button>
      {open && (
        <div className="border-t border-amber-200 dark:border-amber-800/50 p-3 space-y-2.5 text-xs">
          {provenance.source_id && (
            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">
                Source ID
              </span>
              <p className="font-mono text-foreground mt-0.5">{provenance.source_id}</p>
            </div>
          )}
          {provenance.method && (
            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">
                Import Method
              </span>
              <p className="text-foreground mt-0.5">{provenance.method}</p>
            </div>
          )}
          {provenance.upstream_url && (
            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">
                Upstream URL
              </span>
              <p className="font-mono break-all text-foreground mt-0.5">{provenance.upstream_url}</p>
            </div>
          )}
          {provenance.fetched_at && (
            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">
                Fetched At
              </span>
              <p className="text-foreground mt-0.5">
                {new Date(provenance.fetched_at).toLocaleString()}
              </p>
            </div>
          )}
          {provenance.matched_input && (
            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">
                Matched Input
              </span>
              <p className="font-mono text-foreground mt-0.5">{provenance.matched_input}</p>
            </div>
          )}
          {provenance.general_summary && (
            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">
                About This Source
              </span>
              <p className="text-foreground/80 leading-relaxed mt-0.5">{provenance.general_summary}</p>
            </div>
          )}
          <p className="text-[10px] text-amber-700 dark:text-amber-400 italic border-t border-amber-200 dark:border-amber-800/50 pt-2">
            Data from Greg Vaclavek / The Native Plant Nursery (nativeplant.com). Cite the source
            when using this data. No formal data-sharing agreement is in place.
          </p>
        </div>
      )}
    </div>
  );
}

function EcoChip({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="bg-muted/50 rounded-lg px-2.5 py-1.5">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </div>
      <div className="text-xs font-medium text-foreground">{value}</div>
    </div>
  );
}

/** Horizontal range legend key — shown once above the first species with range data. */
function MichiganRangeLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-muted/20 text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/40 transition-colors text-left"
      >
        <span className="font-medium text-muted-foreground flex items-center gap-1.5">
          <Info className="w-3 h-3" />
          Michigan Range Code Legend
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t border-border/40 p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
            {Object.entries(MICHIGAN_RANGE_LEGEND).map(([code, label]) => (
              <div key={code} className="flex items-baseline gap-1.5">
                <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                  {code}
                </span>
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ImageGallery({ images }: { images: NpnImage[] }) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Image className="w-3 h-3" />
        Images ({images.length})
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <div key={img.position} className="flex flex-col gap-1">
            <a
              href={img.url}
              target="_blank"
              rel="noreferrer"
              className="block relative group"
            >
              <img
                src={img.url}
                alt={img.caption || `Image ${img.position}`}
                className="w-full aspect-square object-cover rounded-lg border border-border shadow-sm group-hover:opacity-90 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span
                className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  img.kind === "drawing"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                }`}
              >
                {img.kind === "drawing" ? "Pen & Ink" : "Photo"}
              </span>
              <span className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-3 h-3 text-white drop-shadow" />
              </span>
            </a>
            {img.caption && (
              <p className="text-[10px] text-muted-foreground italic leading-snug px-0.5">
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeciesCard({ sp, defaultOpen = false }: { sp: NpnSpecies; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between p-4 hover:bg-muted/30 transition-colors text-left gap-3"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              {sp.acronym}
            </span>
            <span className="font-semibold italic text-foreground text-sm truncate">
              {sp.latin_name}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{sp.common_name}</div>
          {sp.latin_synonym_greg && (
            <div className="text-[10px] text-muted-foreground/70 italic mt-0.5">
              syn. {sp.latin_synonym_greg}
            </div>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2 pt-0.5">
          {sp.images.length > 0 && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Image className="w-3 h-3" />
              {sp.images.length}
            </span>
          )}
          {open ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-border p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <EcoChip label="Light" value={sp.light} />
            <EcoChip label="Moisture" value={sp.moisture} />
            <EcoChip label="Height" value={sp.height} />
            <EcoChip label="Flowering Time" value={sp.flowering_time} />
            {sp.npn_price_sizes && <EcoChip label="Price / Sizes" value={sp.npn_price_sizes} />}
          </div>

          {sp.habitat && (
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Habitat
              </div>
              <p className="text-xs text-foreground leading-relaxed">{sp.habitat}</p>
            </div>
          )}

          {sp.range_michigan && sp.range_michigan.length > 0 && (
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Michigan Range
              </div>
              <div className="flex flex-wrap gap-1">
                {sp.range_michigan.map((r, i) => (
                  <span
                    key={i}
                    title={expandMichiganRegion(r)}
                    className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 cursor-help"
                  >
                    {r}
                    {MICHIGAN_RANGE_LEGEND[r] ? (
                      <span className="ml-1 text-blue-400 dark:text-blue-500">
                        · {expandMichiganRegion(r)}
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sp.notes && (
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Notes
              </div>
              <p className="text-xs text-foreground leading-relaxed">{sp.notes}</p>
            </div>
          )}

          <ImageGallery images={sp.images} />

          <div className="flex items-center gap-3 pt-1 border-t border-border/50">
            <a
              href={sp.source_url}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              nativeplant.com
            </a>
            <span className="text-[10px] text-muted-foreground">
              Updated {new Date(sp.scraped_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function AnnArborNpnPage() {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [singleResult, setSingleResult] = useState<SpeciesEnvelope | null>(null);
  const [bulkData, setBulkData] = useState<BulkEnvelope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"search" | "browse">("search");

  useEffect(() => {
    if (mode === "browse" && !bulkData) {
      loadAll();
    }
  }, [mode]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}/ann-arbor-npn/species`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as BulkEnvelope;
      setBulkData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const key = inputValue.trim();
    if (!key) return;
    setQuery(key);
    setLoading(true);
    setError(null);
    setSingleResult(null);

    try {
      const r = await fetch(`${API_BASE}/ann-arbor-npn/species/${encodeURIComponent(key)}`);
      const data = (await r.json()) as SpeciesEnvelope;
      setSingleResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const browseSpecies = bulkData?.data?.species ?? [];

  return (
    <SourceExplorerLayout sourceId="ann-arbor-npn">
      <div className="space-y-6">

        {/* Mode tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
          {(["search", "browse"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                mode === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "search" ? (
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search by Name
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Browse All
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Search mode ── */}
        {mode === "search" && (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Acronym, Latin name, synonym, or common name…"
                className="h-11 flex-1"
              />
              <Button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="h-11 px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching…" : "Search"}
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {["LOBSIP", "Gentiana andrewsii", "Blue Wild Indigo", "MONPUN"].map((example) => (
                <button
                  key={example}
                  onClick={() => setInputValue(example)}
                  className="px-2.5 py-1 bg-muted/60 hover:bg-muted rounded-full border border-border/50 text-foreground/70 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {singleResult && (
              <div className="space-y-3">
                {singleResult.found && singleResult.data ? (
                  <>
                    <SpeciesCard sp={singleResult.data} defaultOpen />
                    <MichiganRangeLegend />
                  </>
                ) : (
                  <div className="bg-muted/50 border border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
                    No NPN record found for "{query}". Try an acronym (e.g. LOBSIP), Latin name, or
                    common name.
                    <p className="text-xs mt-1 opacity-70">
                      The species database is empty until the admin import has been run.
                    </p>
                  </div>
                )}
                <ProvenancePanel provenance={singleResult.provenance} />
                <RawPanel
                  title={`Raw API — /api/ann-arbor-npn/species/${encodeURIComponent(query)}`}
                  data={singleResult}
                />
              </div>
            )}

            {!loading && !singleResult && !error && (
              <div className="text-center py-16 text-muted-foreground">
                <Leaf className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  Search by acronym (LOBSIP), Latin name, synonym, or common name.
                </p>
                <p className="text-xs mt-1 opacity-70">
                  All name forms resolve via the alias index.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Browse mode ── */}
        {mode === "browse" && (
          <div className="space-y-4">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading all species…
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {!loading && bulkData && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {browseSpecies.length} species — Ann Arbor Native Plant Nursery (nativeplant.com)
                  </p>
                </div>
                <MichiganRangeLegend />
                {browseSpecies.map((sp) => (
                  <SpeciesCard key={sp.acronym} sp={sp} />
                ))}
                <ProvenancePanel provenance={bulkData.provenance} />
                <RawPanel title="Raw API — /api/ann-arbor-npn/species" data={bulkData} />
              </div>
            )}

            {!loading && !bulkData && !error && (
              <div className="text-center py-12 text-muted-foreground">
                <Leaf className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Loading species list…</p>
              </div>
            )}
          </div>
        )}

      </div>
    </SourceExplorerLayout>
  );
}

export default AnnArborNpnPage;

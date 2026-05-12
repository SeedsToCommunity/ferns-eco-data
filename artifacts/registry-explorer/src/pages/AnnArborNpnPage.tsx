import { useState, useEffect, type FormEvent } from "react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import { Search, ExternalLink, ChevronDown, ChevronUp, Code, Image, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = `${BASE_URL}/api`;

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

interface SpeciesEnvelope {
  found: boolean;
  queried_at: string;
  source_url: string;
  data: NpnSpecies | null;
}

interface BulkEnvelope {
  found: boolean;
  queried_at: string;
  source_url: string;
  data: {
    species_count: number;
    species: NpnSpecies[];
  } | null;
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

function EcoChip({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="bg-muted/50 rounded-lg px-2.5 py-1.5">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</div>
      <div className="text-xs font-medium text-foreground">{value}</div>
    </div>
  );
}

function ImageGallery({ images }: { images: NpnImage[] }) {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) return null;
  const current = images[idx]!;

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Image className="w-3 h-3" />
        Images ({images.length})
      </div>
      <div className="flex gap-3 items-start flex-wrap">
        <div className="relative">
          <img
            src={current.url}
            alt={current.caption || `Image ${current.position}`}
            className="w-36 h-36 object-cover rounded-xl border border-border shadow-sm"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
            current.kind === "drawing"
              ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
              : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
          }`}>
            {current.kind === "drawing" ? "Pen & Ink" : "Photo"}
          </span>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          {current.caption && (
            <p className="text-xs text-muted-foreground italic leading-relaxed">{current.caption}</p>
          )}
          {images.length > 1 && (
            <div className="flex gap-1 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === idx ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
          )}
          <a
            href={current.url}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-2.5 h-2.5" />
            Open image
          </a>
        </div>
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
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{sp.acronym}</span>
            <span className="font-semibold italic text-foreground text-sm truncate">{sp.latin_name}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{sp.common_name}</div>
          {sp.latin_synonym_greg && (
            <div className="text-[10px] text-muted-foreground/70 italic mt-0.5">syn. {sp.latin_synonym_greg}</div>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2 pt-0.5">
          {sp.images.length > 0 && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Image className="w-3 h-3" />
              {sp.images.length}
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
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
              <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Habitat</div>
              <p className="text-xs text-foreground leading-relaxed">{sp.habitat}</p>
            </div>
          )}

          {sp.range_michigan && sp.range_michigan.length > 0 && (
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Michigan Range</div>
              <div className="flex flex-wrap gap-1">
                {sp.range_michigan.map((r, i) => (
                  <span key={i} className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sp.notes && (
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Notes</div>
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
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
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
                <span className="flex items-center gap-2"><Search className="w-4 h-4" />Search by Name</span>
              ) : (
                <span className="flex items-center gap-2"><Leaf className="w-4 h-4" />Browse All</span>
              )}
            </button>
          ))}
        </div>

        {mode === "search" && (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Acronym, Latin name, synonym, or common name…"
                className="h-11 flex-1"
              />
              <Button type="submit" disabled={loading || !inputValue.trim()} className="h-11 px-6">
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching…" : "Search"}
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {["ANDCAN", "Gentiana andrewsii", "Blue Wild Indigo", "MONPUN"].map((example) => (
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
                  <SpeciesCard sp={singleResult.data} defaultOpen />
                ) : (
                  <div className="bg-muted/50 border border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
                    No NPN record found for "{query}". Try an acronym (e.g. ANDCAN), Latin name, or common name.
                  </div>
                )}
                <RawPanel title={`Raw API — /api/ann-arbor-npn/species/${encodeURIComponent(query)}`} data={singleResult} />
              </div>
            )}

            {!loading && !singleResult && !error && (
              <div className="text-center py-16 text-muted-foreground">
                <Leaf className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Search by acronym (ANDCAN), Latin name, synonym, or common name.</p>
                <p className="text-xs mt-1 opacity-70">All name forms resolve via the alias index.</p>
              </div>
            )}
          </div>
        )}

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
                <p className="text-sm text-muted-foreground">
                  {browseSpecies.length} species — Ann Arbor Native Plant Nursery (nativeplant.com)
                </p>
                {browseSpecies.map((sp) => (
                  <SpeciesCard key={sp.acronym} sp={sp} />
                ))}
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

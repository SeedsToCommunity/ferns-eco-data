import { useState, type FormEvent } from "react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import {
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Code,
  Leaf,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = `${BASE_URL}/api`;

const REGION_LABELS: Record<string, string> = {
  L48: "Contiguous US",
  AK: "Alaska",
  HI: "Hawaii",
  PR: "Puerto Rico",
  VI: "US Virgin Islands",
  CAN: "Canada",
  GU: "Guam",
  MP: "N. Mariana Islands",
  SPM: "Saint-Pierre/Miquelon",
  UM: "US Minor Outlying Islands",
};

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
          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

interface NativeStatus {
  Region: string;
  Status: string;
  Type: string;
}

interface UsdaData {
  species: string;
  symbol: string | null;
  canonical_name: string | null;
  common_name: string | null;
  rank: string | null;
  profile_url: string | null;
  native_statuses: NativeStatus[] | null;
  wetland_data: unknown[] | null;
  legal_statuses: unknown[] | null;
  durations: string[] | null;
  growth_habits: string[] | null;
  ancestors: Array<{ Symbol: string; Rank: string; CommonName: string | null }> | null;
  synonyms: unknown[] | null;
  fact_sheet_urls: string[] | null;
  plant_guide_urls: string[] | null;
  cache_status: string;
}

interface UsdaEnvelope {
  found: boolean;
  queried_at: string;
  data: UsdaData;
  provenance: {
    source_id: string;
    fetched_at: string;
    method: string;
    upstream_url: string;
  };
}

interface SearchResultItem {
  id: number;
  symbol: string;
  scientific_name: string;
  scientific_name_without_author: string | null;
  common_name: string | null;
  family_name: string | null;
  is_synonym: boolean;
}

interface SearchEnvelope {
  found: boolean;
  data: {
    query: string;
    field: string;
    page: number;
    total: number;
    results: SearchResultItem[];
  };
}

function NativeStatusTable({ statuses }: { statuses: NativeStatus[] }) {
  if (!statuses || statuses.length === 0) return null;
  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Nativity by Region</div>
      <div className="grid grid-cols-2 gap-1.5">
        {statuses.map((s) => (
          <div key={s.Region} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-muted/40 text-xs">
            <span className="text-muted-foreground">{REGION_LABELS[s.Region] ?? s.Region}</span>
            <span className={cn(
              "font-medium px-1.5 py-0.5 rounded",
              s.Status === "N"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
            )}>
              {s.Status === "N" ? "Native" : "Introduced"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaxonomyChain({ ancestors }: { ancestors: Array<{ Symbol: string; Rank: string; CommonName: string | null }> }) {
  if (!ancestors || ancestors.length === 0) return null;
  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Taxonomy</div>
      <div className="flex flex-wrap gap-1.5">
        {ancestors.map((a) => (
          <div key={a.Symbol} className="flex flex-col items-center px-2 py-1 bg-muted/40 rounded-lg text-xs">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{a.Rank}</span>
            <span className="font-medium">{a.Symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeciesResultCard({ result }: { result: UsdaEnvelope }) {
  const d = result.data;

  return (
    <div className="space-y-4">
      {result.found ? (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">{d.symbol}</div>
              <div className="text-sm text-muted-foreground italic">{d.canonical_name}</div>
              {d.common_name && <div className="text-sm font-medium mt-0.5">{d.common_name}</div>}
              {d.rank && <div className="text-xs text-muted-foreground mt-0.5">{d.rank}</div>}
            </div>
            {d.profile_url && (
              <a
                href={d.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                USDA Profile
              </a>
            )}
          </div>

          {d.durations && d.durations.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {d.durations.map((dur) => (
                <span key={dur} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{dur}</span>
              ))}
              {d.growth_habits?.map((gh) => (
                <span key={gh} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{gh}</span>
              ))}
            </div>
          )}

          {d.native_statuses && <NativeStatusTable statuses={d.native_statuses} />}

          {d.ancestors && <TaxonomyChain ancestors={d.ancestors as Array<{ Symbol: string; Rank: string; CommonName: string | null }>} />}

          {d.fact_sheet_urls && d.fact_sheet_urls.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Documents</div>
              <div className="flex flex-wrap gap-2">
                {d.fact_sheet_urls.map((u, i) => (
                  <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Fact Sheet {d.fact_sheet_urls!.length > 1 ? i + 1 : ""}
                  </a>
                ))}
                {d.plant_guide_urls?.map((u, i) => (
                  <a key={`pg-${i}`} href={u} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Plant Guide {d.plant_guide_urls!.length > 1 ? i + 1 : ""}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          No USDA PLANTS record found for <span className="font-medium">{d.species}</span>.
        </div>
      )}

      <RawPanel title="Full API Response" data={result} />
    </div>
  );
}

function SearchResultsCard({ result }: { result: SearchEnvelope }) {
  const d = result.data;
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        {d.total} result{d.total !== 1 ? "s" : ""} for <span className="font-medium">"{d.query}"</span> by {d.field}
      </div>
      {d.results.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">No results found.</div>
      ) : (
        <div className="space-y-2">
          {d.results.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-card p-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold">{r.symbol}</span>
                  {r.is_synonym && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">synonym</span>}
                </div>
                <div className="text-xs text-muted-foreground italic">{r.scientific_name}</div>
                {r.common_name && <div className="text-xs">{r.common_name}</div>}
                {r.family_name && <div className="text-[10px] text-muted-foreground">{r.family_name}</div>}
              </div>
              <a
                href={`https://plants.sc.egov.usda.gov/?symbol=${encodeURIComponent(r.symbol)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline shrink-0 flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Profile
              </a>
            </div>
          ))}
        </div>
      )}
      <RawPanel title="Full API Response" data={result} />
    </div>
  );
}

type ActiveTab = "species" | "search";

export default function UsdaPlantsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("species");

  const [speciesInput, setSpeciesInput] = useState("");
  const [speciesResult, setSpeciesResult] = useState<UsdaEnvelope | null>(null);
  const [speciesLoading, setSpeciesLoading] = useState(false);
  const [speciesError, setSpeciesError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchField, setSearchField] = useState("Scientific Name");
  const [searchResult, setSearchResult] = useState<SearchEnvelope | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  async function handleSpeciesSubmit(e: FormEvent) {
    e.preventDefault();
    if (!speciesInput.trim()) return;
    setSpeciesLoading(true);
    setSpeciesError(null);
    setSpeciesResult(null);
    try {
      const resp = await fetch(`${API_BASE}/usda-plants?species=${encodeURIComponent(speciesInput.trim())}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json() as UsdaEnvelope;
      setSpeciesResult(data);
    } catch (err) {
      setSpeciesError(String(err));
    } finally {
      setSpeciesLoading(false);
    }
  }

  async function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);
    try {
      const resp = await fetch(
        `${API_BASE}/usda-plants/search?q=${encodeURIComponent(searchInput.trim())}&field=${encodeURIComponent(searchField)}`,
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json() as SearchEnvelope;
      setSearchResult(data);
    } catch (err) {
      setSearchError(String(err));
    } finally {
      setSearchLoading(false);
    }
  }

  return (
    <SourceExplorerLayout sourceId="usda-plants">
      <div className="space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("species")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "species"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            <span className="flex items-center gap-2"><Leaf className="w-4 h-4" /> Species Lookup</span>
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "search"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Search</span>
          </button>
        </div>

        {activeTab === "species" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Species Lookup</h3>
              <p className="text-sm text-muted-foreground">
                Resolve a scientific name to a USDA symbol and retrieve the full plant profile including nativity status,
                wetland data, taxonomy, and document links.
              </p>
            </div>
            <form onSubmit={handleSpeciesSubmit} className="flex gap-2">
              <Input
                value={speciesInput}
                onChange={(e) => setSpeciesInput(e.target.value)}
                placeholder="e.g. Asclepias tuberosa"
                className="flex-1"
              />
              <Button type="submit" disabled={speciesLoading}>
                {speciesLoading ? "Looking up…" : "Look up"}
              </Button>
            </form>
            {speciesError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {speciesError}
              </div>
            )}
            {speciesResult && <SpeciesResultCard result={speciesResult} />}
          </div>
        )}

        {activeTab === "search" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Text Search</h3>
              <p className="text-sm text-muted-foreground">
                Search the USDA PLANTS database by scientific name, common name, symbol, or family.
              </p>
            </div>
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g. Trillium, butterfly milkweed"
                  className="flex-1"
                />
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                  <option>Scientific Name</option>
                  <option>Common Name</option>
                  <option>Symbol</option>
                  <option>Family</option>
                </select>
                <Button type="submit" disabled={searchLoading}>
                  {searchLoading ? "Searching…" : "Search"}
                </Button>
              </div>
            </form>
            {searchError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {searchError}
              </div>
            )}
            {searchResult && <SearchResultsCard result={searchResult} />}
          </div>
        )}

        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <MapPin className="w-3.5 h-3.5" /> API Endpoints
          </div>
          <div className="space-y-1 text-xs font-mono text-muted-foreground">
            <div>GET /api/usda-plants?species=Asclepias+tuberosa</div>
            <div>GET /api/usda-plants/profile?symbol=ASTU</div>
            <div>GET /api/usda-plants/search?q=Trillium&amp;field=Scientific+Name</div>
            <div>GET /api/usda-plants/metadata</div>
          </div>
        </div>
      </div>
    </SourceExplorerLayout>
  );
}

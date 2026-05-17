import { useState } from "react";
import { useApiGet } from "@/hooks/useApiGet";
import { Loader2, Search, ExternalLink, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";

const BASE_URL = import.meta.env.BASE_URL ?? "/";

function apiUrl(path: string, params: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, window.location.origin + BASE_URL);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString().replace(window.location.origin, "");
}

interface Props {
  preloadedTaxonId?: number | null;
  preloadedPlaceId?: string;
  onTaxonSelected?: (taxonId: number, taxonName: string) => void;
}

type Panel = "similar" | "ident-counts" | "recent" | "taxon-summary" | "identifications";

const PANELS: { id: Panel; label: string }[] = [
  { id: "similar", label: "Similar Species" },
  { id: "ident-counts", label: "Ident Counts" },
  { id: "recent", label: "Recent Taxa" },
  { id: "taxon-summary", label: "Taxon Summary" },
  { id: "identifications", label: "Identifications" },
];

export function DiscoveryTab({ preloadedTaxonId, preloadedPlaceId, onTaxonSelected }: Props) {
  const [activePanel, setActivePanel] = useState<Panel>("similar");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {PANELS.map((panel) => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
              activePanel === panel.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/70"
            }`}
          >
            {panel.label}
          </button>
        ))}
      </div>

      {activePanel === "similar" && (
        <SimilarSpeciesPanel preloadedTaxonId={preloadedTaxonId} preloadedPlaceId={preloadedPlaceId} onTaxonSelected={onTaxonSelected} />
      )}
      {activePanel === "ident-counts" && (
        <IdentCountsPanel preloadedPlaceId={preloadedPlaceId} onTaxonSelected={onTaxonSelected} />
      )}
      {activePanel === "recent" && (
        <RecentTaxaPanel preloadedPlaceId={preloadedPlaceId} onTaxonSelected={onTaxonSelected} />
      )}
      {activePanel === "taxon-summary" && <TaxonSummaryPanel />}
      {activePanel === "identifications" && (
        <IdentificationsPanel preloadedTaxonId={preloadedTaxonId} preloadedPlaceId={preloadedPlaceId} />
      )}
    </div>
  );
}

// ── Similar Species ──────────────────────────────────────────────────────────

function SimilarSpeciesPanel({
  preloadedTaxonId,
  preloadedPlaceId,
  onTaxonSelected,
}: {
  preloadedTaxonId?: number | null;
  preloadedPlaceId?: string;
  onTaxonSelected?: (taxonId: number, taxonName: string) => void;
}) {
  const [taxonIdInput, setTaxonIdInput] = useState(preloadedTaxonId ? String(preloadedTaxonId) : "");
  const [placeIdInput, setPlaceIdInput] = useState(preloadedPlaceId ?? "");
  const [submitted, setSubmitted] = useState<{ taxonId: number; placeId?: number } | null>(null);

  const url = submitted
    ? apiUrl("/api/inat/similar-species", {
        taxon_id: submitted.taxonId,
        place_id: submitted.placeId,
      })
    : null;

  const { data, loading, error } = useApiGet<{
    found: boolean;
    source_url: string;
    data: {
      total_results?: number;
      results: Array<{
        count: number;
        taxon: {
          id: number;
          name: string;
          rank?: string;
          preferred_common_name?: string;
          default_photo?: { square_url?: string };
        };
      }>;
    };
  }>(url);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tid = Number(taxonIdInput.trim());
    if (!tid) return;
    const pid = placeIdInput.trim() ? Number(placeIdInput.trim()) : undefined;
    setSubmitted({ taxonId: tid, placeId: pid });
  }

  const results = data?.data?.results ?? [];

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-1">Similar Species</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Species commonly confused with a taxon, ranked by co-confusion count from iNaturalist identifications.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Taxon ID (required)</label>
            <input
              type="number"
              value={taxonIdInput}
              onChange={(e) => setTaxonIdInput(e.target.value)}
              placeholder="e.g. 47603"
              className="w-36 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Place ID (optional)</label>
            <input
              type="number"
              value={placeIdInput}
              onChange={(e) => setPlaceIdInput(e.target.value)}
              placeholder="e.g. 2649"
              className="w-36 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !taxonIdInput.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Find similar
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Try:{" "}
          <button
            onClick={() => { setTaxonIdInput("47603"); setPlaceIdInput("2649"); setSubmitted({ taxonId: 47603, placeId: 2649 }); }}
            className="underline text-primary hover:no-underline"
          >
            Quercus (47603) in Washtenaw Co
          </button>
        </p>
      </div>

      {error && <ErrorBlock message={error} />}

      {!loading && submitted && data && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {results.length === 0 ? "No similar species found." : `${results.length} taxa commonly confused with taxon ${submitted.taxonId}`}
          </p>
          <div className="space-y-1">
            {results.map((entry) => (
              <div key={entry.taxon.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-3 py-2.5 hover:border-primary/30 transition-colors">
                <div className="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-muted border border-border">
                  {entry.taxon.default_photo?.square_url ? (
                    <img src={entry.taxon.default_photo.square_url} alt={entry.taxon.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">?</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium italic truncate">{entry.taxon.name}</p>
                  {entry.taxon.preferred_common_name && (
                    <p className="text-xs text-muted-foreground truncate">{entry.taxon.preferred_common_name}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums">{entry.count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">confused</p>
                </div>
                <div className="shrink-0 flex gap-1">
                  {onTaxonSelected && (
                    <button
                      onClick={() => onTaxonSelected(entry.taxon.id, entry.taxon.name)}
                      className="px-2 py-1 rounded-md text-xs text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
                    >
                      Use →
                    </button>
                  )}
                  <a
                    href={`https://www.inaturalist.org/taxa/${entry.taxon.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <RawJsonPanel title="Raw API — /api/inat/similar-species" data={data} />
        </div>
      )}
    </div>
  );
}

// ── Identification Counts ────────────────────────────────────────────────────

const QUALITY_GRADES = [
  { value: "", label: "Any" },
  { value: "research", label: "Research grade" },
  { value: "needs_id", label: "Needs ID" },
  { value: "casual", label: "Casual" },
];

const TAXON_OF_OPTIONS = [
  { value: "", label: "Default (identification)" },
  { value: "identification", label: "Identification taxon" },
  { value: "community", label: "Community taxon" },
];

function IdentCountsPanel({
  preloadedPlaceId,
  onTaxonSelected,
}: {
  preloadedPlaceId?: string;
  onTaxonSelected?: (taxonId: number, taxonName: string) => void;
}) {
  const [placeIdInput, setPlaceIdInput] = useState(preloadedPlaceId ?? "");
  const [qualityGrade, setQualityGrade] = useState("research");
  const [taxonOf, setTaxonOf] = useState("");
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [submittedParams, setSubmittedParams] = useState<Record<string, string | number | undefined> | null>(null);

  const url = submittedParams ? apiUrl("/api/inat/identification-species-counts", submittedParams) : null;

  const { data, loading, error } = useApiGet<{
    found: boolean;
    data: {
      total_results?: number;
      results: Array<{
        count: number;
        taxon: { id: number; name: string; preferred_common_name?: string; default_photo?: { square_url?: string } };
      }>;
    };
  }>(url);

  function buildParams(pg: number) {
    const pid = placeIdInput.trim() ? Number(placeIdInput.trim()) : undefined;
    return {
      place_id: pid,
      quality_grade: qualityGrade || undefined,
      taxon_of: taxonOf || undefined,
      per_page: perPage,
      page: pg,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSubmittedParams(buildParams(1));
  }

  function goToPage(pg: number) {
    setPage(pg);
    setSubmittedParams(buildParams(pg));
  }

  const results = data?.data?.results ?? [];
  const total = data?.data?.total_results ?? 0;
  const totalPgs = total > 0 ? Math.ceil(total / perPage) : 0;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-1">Identification Species Counts</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Species ranked by community identification activity — distinct from raw observation counts.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Place ID</label>
            <input
              type="number"
              value={placeIdInput}
              onChange={(e) => setPlaceIdInput(e.target.value)}
              placeholder="e.g. 2649"
              className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Quality</label>
            <select value={qualityGrade} onChange={(e) => setQualityGrade(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {QUALITY_GRADES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Taxon of</label>
            <select value={taxonOf} onChange={(e) => setTaxonOf(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {TAXON_OF_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Fetch counts
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Try:{" "}
          <button
            onClick={() => {
              setPlaceIdInput("2649"); setQualityGrade("research"); setTaxonOf(""); setPage(1);
              setSubmittedParams({ place_id: 2649, quality_grade: "research", per_page: 25, page: 1 });
            }}
            className="underline text-primary hover:no-underline"
          >
            Washtenaw Co (2649), research
          </button>
        </p>
      </div>

      {error && <ErrorBlock message={error} />}

      {!loading && submittedParams && data && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {total === 0 ? "No results" : <>{total.toLocaleString()} species{totalPgs > 1 && <> · page {page} of {totalPgs}</>}</>}
            </p>
            {totalPgs > 1 && <PageControls page={page} totalPgs={totalPgs} loading={loading} onPage={goToPage} />}
          </div>
          <div className="space-y-1">
            {results.map((entry, idx) => (
              <SimpleSpeciesRow
                key={entry.taxon.id}
                rank={(page - 1) * perPage + idx + 1}
                taxon={entry.taxon}
                count={entry.count}
                countLabel="idents"
                onUse={onTaxonSelected ? () => onTaxonSelected(entry.taxon.id, entry.taxon.name) : undefined}
              />
            ))}
          </div>
          {totalPgs > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <span className="text-xs text-muted-foreground self-center">Page {page} of {totalPgs}</span>
              <button onClick={() => goToPage(page + 1)} disabled={page >= totalPgs || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-40"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <RawJsonPanel title="Raw API — /api/inat/identification-species-counts" data={data} />
        </div>
      )}
    </div>
  );
}

// ── Recent Taxa ──────────────────────────────────────────────────────────────

function RecentTaxaPanel({
  preloadedPlaceId,
  onTaxonSelected,
}: {
  preloadedPlaceId?: string;
  onTaxonSelected?: (taxonId: number, taxonName: string) => void;
}) {
  const [placeIdInput, setPlaceIdInput] = useState(preloadedPlaceId ?? "");
  const [qualityGrade, setQualityGrade] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [submittedParams, setSubmittedParams] = useState<Record<string, string | number | undefined> | null>(null);

  const url = submittedParams ? apiUrl("/api/inat/recent-taxa", submittedParams) : null;

  const { data, loading, error } = useApiGet<{
    found: boolean;
    data: {
      results: Array<{
        taxon: { id: number; name: string; rank?: string; preferred_common_name?: string; default_photo?: { square_url?: string } };
        last_observation?: { observed_on?: string };
      }>;
    };
  }>(url);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pid = placeIdInput.trim() ? Number(placeIdInput.trim()) : undefined;
    setSubmittedParams({ place_id: pid, quality_grade: qualityGrade || undefined, per_page: perPage });
  }

  const results = data?.data?.results ?? [];

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-1">Recent Taxa</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Taxa recently identified in a place — what's being documented right now.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Place ID</label>
            <input
              type="number"
              value={placeIdInput}
              onChange={(e) => setPlaceIdInput(e.target.value)}
              placeholder="e.g. 2649"
              className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Quality</label>
            <select value={qualityGrade} onChange={(e) => setQualityGrade(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {QUALITY_GRADES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Per page</label>
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Fetch recent
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Try:{" "}
          <button
            onClick={() => { setPlaceIdInput("10"); setQualityGrade("research"); setSubmittedParams({ place_id: 10, quality_grade: "research", per_page: 20 }); }}
            className="underline text-primary hover:no-underline"
          >
            Michigan (10), research
          </button>
        </p>
      </div>

      {error && <ErrorBlock message={error} />}

      {!loading && submittedParams && data && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{results.length === 0 ? "No recent taxa found." : `${results.length} recently identified taxa`}</p>
          <div className="space-y-1">
            {results.map((entry) => (
              <div key={entry.taxon.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-3 py-2.5 hover:border-primary/30 transition-colors">
                <div className="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-muted border border-border">
                  {entry.taxon.default_photo?.square_url ? (
                    <img src={entry.taxon.default_photo.square_url} alt={entry.taxon.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">?</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium italic truncate">{entry.taxon.name}</p>
                  {entry.taxon.preferred_common_name && (
                    <p className="text-xs text-muted-foreground truncate">{entry.taxon.preferred_common_name}</p>
                  )}
                </div>
                {entry.last_observation?.observed_on && (
                  <span className="shrink-0 text-xs text-muted-foreground">{entry.last_observation.observed_on}</span>
                )}
                <div className="shrink-0 flex gap-1">
                  {onTaxonSelected && (
                    <button
                      onClick={() => onTaxonSelected(entry.taxon.id, entry.taxon.name)}
                      className="px-2 py-1 rounded-md text-xs text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
                    >
                      Use →
                    </button>
                  )}
                  <a href={`https://www.inaturalist.org/taxa/${entry.taxon.id}`} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <RawJsonPanel title="Raw API — /api/inat/recent-taxa" data={data} />
        </div>
      )}
    </div>
  );
}

// ── Taxon Summary ────────────────────────────────────────────────────────────

function TaxonSummaryPanel() {
  const [obsIdInput, setObsIdInput] = useState("");
  const [submitted, setSubmitted] = useState<number | null>(null);

  const url = submitted ? apiUrl("/api/inat/taxon-summary", { observation_id: submitted }) : null;

  const { data, loading, error } = useApiGet<{
    found: boolean;
    source_url: string;
    data: {
      wikipedia_summary?: string;
      conservation_status?: {
        authority?: string;
        status?: string;
        status_name?: string;
        iucn?: number;
      };
      listed_taxon?: {
        establishment_means?: string;
        place?: { id?: number; display_name?: string };
      };
    };
  }>(url);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = Number(obsIdInput.trim());
    if (id > 0) setSubmitted(id);
  }

  const d = data?.data;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-1">Taxon Summary</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Wikipedia summary, place-specific nativity, and conservation status for the taxon at a specific observation's location.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Observation ID (required)</label>
            <input
              type="number"
              value={obsIdInput}
              onChange={(e) => setObsIdInput(e.target.value)}
              placeholder="e.g. 100000000"
              className="w-44 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button type="submit" disabled={loading || !obsIdInput.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Fetch summary
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Enter any observation ID from iNaturalist — the taxon's Wikipedia summary and nativity context will be returned.
        </p>
      </div>

      {error && <ErrorBlock message={error} />}

      {!loading && submitted && data && (
        <div className="space-y-3">
          {d?.wikipedia_summary && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Wikipedia Summary</h4>
              <p className="text-sm leading-relaxed">{d.wikipedia_summary}</p>
            </div>
          )}

          {d?.listed_taxon && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Nativity at Observation Location</h4>
              <div className="flex items-center gap-3">
                {d.listed_taxon.establishment_means && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    d.listed_taxon.establishment_means === "native"
                      ? "bg-green-500/15 text-green-700 dark:text-green-400"
                      : d.listed_taxon.establishment_means === "introduced"
                      ? "bg-orange-500/15 text-orange-700 dark:text-orange-400"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {d.listed_taxon.establishment_means}
                  </span>
                )}
                {d.listed_taxon.place?.display_name && (
                  <span className="text-sm text-muted-foreground">{d.listed_taxon.place.display_name}</span>
                )}
              </div>
            </div>
          )}

          {d?.conservation_status && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Conservation Status</h4>
              <div className="flex items-center gap-3">
                {d.conservation_status.status && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-muted border border-border">
                    {d.conservation_status.status.toUpperCase()}
                  </span>
                )}
                {d.conservation_status.status_name && (
                  <span className="text-sm">{d.conservation_status.status_name}</span>
                )}
                {d.conservation_status.authority && (
                  <span className="text-xs text-muted-foreground">({d.conservation_status.authority})</span>
                )}
              </div>
            </div>
          )}

          {data.found === false && (
            <div className="text-center py-8 text-muted-foreground text-sm">No summary data returned for this observation.</div>
          )}

          <RawJsonPanel title="Raw API — /api/inat/taxon-summary" data={data} />
        </div>
      )}
    </div>
  );
}

// ── Identifications ──────────────────────────────────────────────────────────

function IdentificationsPanel({
  preloadedTaxonId,
  preloadedPlaceId,
}: {
  preloadedTaxonId?: number | null;
  preloadedPlaceId?: string;
}) {
  const [taxonIdInput, setTaxonIdInput] = useState(preloadedTaxonId ? String(preloadedTaxonId) : "");
  const [placeIdInput, setPlaceIdInput] = useState(preloadedPlaceId ?? "");
  const [qualityGrade, setQualityGrade] = useState("research");
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [submittedParams, setSubmittedParams] = useState<Record<string, string | number | undefined> | null>(null);

  const url = submittedParams ? apiUrl("/api/inat/identifications", submittedParams) : null;

  const { data, loading, error } = useApiGet<{
    found: boolean;
    data: {
      total_results?: number;
      page?: number;
      per_page?: number;
      results: Array<{
        id: number;
        created_at?: string;
        taxon?: { id: number; name: string; preferred_common_name?: string; rank?: string; default_photo?: { square_url?: string } };
        user?: { id: number; login: string };
        observation?: { id: number; quality_grade?: string };
        category?: string;
        current?: boolean;
      }>;
    };
  }>(url);

  function buildParams(pg: number) {
    return {
      taxon_id:      taxonIdInput.trim() ? Number(taxonIdInput.trim()) : undefined,
      place_id:      placeIdInput.trim() ? Number(placeIdInput.trim()) : undefined,
      quality_grade: qualityGrade || undefined,
      per_page:      perPage,
      page:          pg,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSubmittedParams(buildParams(1));
  }

  function goToPage(pg: number) {
    setPage(pg);
    setSubmittedParams(buildParams(pg));
  }

  const results = data?.data?.results ?? [];
  const total = data?.data?.total_results ?? 0;
  const totalPgs = total > 0 ? Math.ceil(Math.min(total, 10000) / perPage) : 0;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-1">Identifications</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Individual identification records from iNaturalist — who identified what taxon on which observation.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Taxon ID</label>
            <input type="number" value={taxonIdInput} onChange={(e) => setTaxonIdInput(e.target.value)}
              placeholder="e.g. 47603"
              className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Place ID</label>
            <input type="number" value={placeIdInput} onChange={(e) => setPlaceIdInput(e.target.value)}
              placeholder="e.g. 2649"
              className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Quality</label>
            <select value={qualityGrade} onChange={(e) => setQualityGrade(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {QUALITY_GRADES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Fetch idents
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Try:{" "}
          <button
            onClick={() => {
              setTaxonIdInput("47603"); setPlaceIdInput("2649"); setQualityGrade("research"); setPage(1);
              setSubmittedParams({ taxon_id: 47603, place_id: 2649, quality_grade: "research", per_page: 20, page: 1 });
            }}
            className="underline text-primary hover:no-underline"
          >
            Quercus (47603) in Washtenaw Co, research
          </button>
        </p>
      </div>

      {error && <ErrorBlock message={error} />}

      {!loading && submittedParams && data && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {total === 0 ? "No identifications found." : <>{total.toLocaleString()} identifications{totalPgs > 1 && <> · page {page} of {totalPgs}</>}</>}
            </p>
            {totalPgs > 1 && <PageControls page={page} totalPgs={totalPgs} loading={loading} onPage={goToPage} />}
          </div>
          <div className="space-y-1">
            {results.map((ident) => (
              <div key={ident.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-3 py-2.5 hover:border-primary/30 transition-colors">
                <div className="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-muted border border-border">
                  {ident.taxon?.default_photo?.square_url ? (
                    <img src={ident.taxon.default_photo.square_url} alt={ident.taxon.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">?</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium italic truncate">{ident.taxon?.name ?? `ID #${ident.id}`}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    by {ident.user?.login ?? "unknown"}
                    {ident.created_at && <> · {ident.created_at.slice(0, 10)}</>}
                    {ident.observation?.id && <> · obs #{ident.observation.id}</>}
                  </p>
                </div>
                {ident.category && (
                  <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{ident.category}</span>
                )}
                {ident.observation?.id && (
                  <a
                    href={`https://www.inaturalist.org/observations/${ident.observation.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
          {totalPgs > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <span className="text-xs text-muted-foreground self-center">Page {page} of {totalPgs}</span>
              <button onClick={() => goToPage(page + 1)} disabled={page >= totalPgs || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-40"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <RawJsonPanel title="Raw API — /api/inat/identifications" data={data} />
        </div>
      )}
    </div>
  );
}

// ── Shared helpers ───────────────────────────────────────────────────────────

function SimpleSpeciesRow({
  rank,
  taxon,
  count,
  countLabel,
  onUse,
}: {
  rank: number;
  taxon: { id: number; name: string; preferred_common_name?: string; default_photo?: { square_url?: string } };
  count: number;
  countLabel: string;
  onUse?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-3 py-2.5 hover:border-primary/30 transition-colors">
      <span className="w-7 text-right text-xs font-mono text-muted-foreground/60 shrink-0">#{rank}</span>
      <div className="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-muted border border-border">
        {taxon.default_photo?.square_url ? (
          <img src={taxon.default_photo.square_url} alt={taxon.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">?</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium italic truncate">{taxon.name}</p>
        {taxon.preferred_common_name && <p className="text-xs text-muted-foreground truncate">{taxon.preferred_common_name}</p>}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold tabular-nums">{count.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{countLabel}</p>
      </div>
      <div className="shrink-0 flex gap-1">
        {onUse && (
          <button onClick={onUse} className="px-2 py-1 rounded-md text-xs text-primary border border-primary/20 hover:bg-primary/10 transition-colors">
            Use →
          </button>
        )}
        <a href={`https://www.inaturalist.org/taxa/${taxon.id}`} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function PageControls({
  page,
  totalPgs,
  loading,
  onPage,
}: {
  page: number;
  totalPgs: number;
  loading: boolean;
  onPage: (pg: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onPage(page - 1)} disabled={page <= 1 || loading}
        className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-xs px-2 text-muted-foreground">{page} / {totalPgs}</span>
      <button onClick={() => onPage(page + 1)} disabled={page >= totalPgs || loading}
        className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

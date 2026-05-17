import { useState, useEffect } from "react";
import { BarChart2, Search, Loader2, AlertCircle, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";

const QUALITY_GRADES = [
  { value: "", label: "Any" },
  { value: "research", label: "Research grade" },
  { value: "needs_id", label: "Needs ID" },
  { value: "casual", label: "Casual" },
];

const ICONIC_TAXA = [
  { value: "", label: "All groups" },
  { value: "Plantae", label: "Plantae" },
  { value: "Aves", label: "Aves" },
  { value: "Fungi", label: "Fungi" },
  { value: "Mammalia", label: "Mammalia" },
  { value: "Insecta", label: "Insecta" },
  { value: "Arachnida", label: "Arachnida" },
  { value: "Reptilia", label: "Reptilia" },
  { value: "Amphibia", label: "Amphibia" },
  { value: "Actinopterygii", label: "Actinopterygii" },
  { value: "Mollusca", label: "Mollusca" },
  { value: "Animalia", label: "Animalia" },
];

const TERM_PRESETS = [
  { label: "All", termId: undefined, termValueId: undefined },
  { label: "Plant Phenology (flowering/fruiting)", termId: 12, termValueId: undefined },
];

const PER_PAGE_OPTIONS = [10, 25, 50, 100, 200, 500];

interface SpeciesCountsTabProps {
  preloadedPlaceId?: string;
  preloadedPlaceName?: string;
  onTaxonSelected?: (taxonId: number, taxonName: string) => void;
}

interface SpeciesCountEntry {
  count: number;
  taxon: {
    id: number;
    name: string;
    preferred_common_name?: string;
    default_photo?: { square_url?: string; attribution?: string } | null;
    observations_count?: number;
  };
}

interface CommittedParams {
  placeId?: number;
  qualityGrade?: string;
  iconicTaxonName?: string;
  native?: boolean;
  introduced?: boolean;
  termId?: number;
  termValueId?: number;
  month?: string;
  perPage: number;
  page: number;
}

export function SpeciesCountsTab({
  preloadedPlaceId,
  onTaxonSelected,
}: SpeciesCountsTabProps) {
  const [placeIdInput, setPlaceIdInput]             = useState(preloadedPlaceId ?? "");
  const [qualityGrade, setQualityGrade]             = useState("research");
  const [iconicTaxonName, setIconicTaxonName]       = useState("Plantae");
  const [nativeFilter, setNativeFilter]             = useState<"" | "native" | "introduced">("");
  const [termPresetIdx, setTermPresetIdx]           = useState(0);
  const [monthInput, setMonthInput]                 = useState("");
  const [perPage, setPerPage]                       = useState(50);

  useEffect(() => {
    if (preloadedPlaceId) setPlaceIdInput(preloadedPlaceId);
  }, [preloadedPlaceId]);

  const [submitted, setSubmitted]                   = useState(false);
  const [committed, setCommitted]                   = useState<CommittedParams | null>(null);

  const [data, setData]                             = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading]                   = useState(false);
  const [isError, setIsError]                       = useState(false);
  const [errorMsg, setErrorMsg]                     = useState("");

  async function fetchCounts(params: CommittedParams) {
    setIsLoading(true);
    setIsError(false);
    setErrorMsg("");
    setData(null);

    const q = new URLSearchParams();
    if (params.placeId !== undefined) q.set("place_id", String(params.placeId));
    if (params.qualityGrade) q.set("quality_grade", params.qualityGrade);
    if (params.iconicTaxonName) q.set("iconic_taxon_name", params.iconicTaxonName);
    if (params.native) q.set("native", "true");
    if (params.introduced) q.set("introduced", "true");
    if (params.termId !== undefined) q.set("term_id", String(params.termId));
    if (params.termValueId !== undefined) q.set("term_value_id", String(params.termValueId));
    if (params.month) q.set("month", params.month);
    q.set("per_page", String(params.perPage));
    q.set("page", String(params.page));

    try {
      const res = await fetch(`/api/inat/species-counts?${q.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setIsError(true);
      setErrorMsg((err as Error).message ?? "Failed to fetch species counts");
    } finally {
      setIsLoading(false);
    }
  }

  function commit(params: CommittedParams) {
    setCommitted(params);
    setSubmitted(true);
    fetchCounts(params);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const rawPl = Number(placeIdInput.trim());
    const placeId = placeIdInput.trim() && !isNaN(rawPl) && rawPl > 0 ? rawPl : undefined;
    const preset = TERM_PRESETS[termPresetIdx];

    commit({
      placeId,
      qualityGrade: qualityGrade || undefined,
      iconicTaxonName: iconicTaxonName || undefined,
      native: nativeFilter === "native" ? true : undefined,
      introduced: nativeFilter === "introduced" ? true : undefined,
      termId: preset?.termId,
      termValueId: preset?.termValueId,
      month: monthInput.trim() || undefined,
      perPage,
      page: 1,
    });
  }

  function runExample(placeId: string, quality: string, iconic: string, nativity: "" | "native" | "introduced") {
    setPlaceIdInput(placeId);
    setQualityGrade(quality);
    setIconicTaxonName(iconic);
    setNativeFilter(nativity);
    setTermPresetIdx(0);
    setMonthInput("");
    const rawPl = Number(placeId);
    commit({
      placeId: placeId && !isNaN(rawPl) && rawPl > 0 ? rawPl : undefined,
      qualityGrade: quality || undefined,
      iconicTaxonName: iconic || undefined,
      native: nativity === "native" ? true : undefined,
      introduced: nativity === "introduced" ? true : undefined,
      perPage,
      page: 1,
    });
  }

  function goToPage(pg: number) {
    if (!committed) return;
    const next = { ...committed, page: pg };
    commit(next);
  }

  const respData = (data as { data?: Record<string, unknown> } | null)?.data ?? null;
  const results  = (respData?.["results"] ?? []) as SpeciesCountEntry[];
  const total    = typeof respData?.["total_results"] === "number" ? respData["total_results"] as number : 0;
  const page     = committed?.page ?? 1;
  const totalPgs = total > 0 ? Math.ceil(total / perPage) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Species Counts</h2>
            <p className="text-xs text-muted-foreground">
              Species ranked by observation count from iNaturalist — live passthrough, no cache.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Place ID (optional)</label>
              <input
                type="number"
                value={placeIdInput}
                onChange={(e) => setPlaceIdInput(e.target.value)}
                placeholder="e.g. 2649"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Quality grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {QUALITY_GRADES.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Iconic taxon</label>
              <select
                value={iconicTaxonName}
                onChange={(e) => setIconicTaxonName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {ICONIC_TAXA.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Nativity</label>
              <select
                value={nativeFilter}
                onChange={(e) => setNativeFilter(e.target.value as "" | "native" | "introduced")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Any</option>
                <option value="native">Native only</option>
                <option value="introduced">Introduced only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Annotation filter</label>
              <select
                value={termPresetIdx}
                onChange={(e) => setTermPresetIdx(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {TERM_PRESETS.map((p, i) => (
                  <option key={i} value={i}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Months</label>
              <input
                type="text"
                value={monthInput}
                onChange={(e) => setMonthInput(e.target.value)}
                placeholder="e.g. 4,5,6"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Results per page</label>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Fetch species counts
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-3">
          Try:{" "}
          <button onClick={() => runExample("2649", "research", "Plantae", "native")} className="underline text-primary hover:no-underline">
            Native plants in Washtenaw Co (2649), research
          </button>
          {" · "}
          <button onClick={() => runExample("10", "research", "Aves", "")} className="underline text-primary hover:no-underline">
            Birds in Michigan (10), research
          </button>
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && submitted && data && respData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total === 0
                ? "No species found"
                : <>
                    {total.toLocaleString()} species
                    {totalPgs > 1 && <> · page {page} of {totalPgs}</>}
                  </>
              }
            </p>
            {totalPgs > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1 || isLoading}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs px-2 text-muted-foreground">{page} / {totalPgs}</span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPgs || isLoading}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No species found.</div>
          ) : (
            <div className="space-y-1">
              {results.map((entry, idx) => (
                <SpeciesCountRow
                  key={entry.taxon.id}
                  rank={(page - 1) * perPage + idx + 1}
                  entry={entry}
                  onViewPhenology={onTaxonSelected ? () => onTaxonSelected(entry.taxon.id, entry.taxon.name) : undefined}
                />
              ))}
            </div>
          )}

          {totalPgs > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || isLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <span className="text-xs text-muted-foreground">Page {page} of {totalPgs}</span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPgs || isLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <RawJsonPanel title="Raw API — /api/inat/species-counts" data={data} />
        </div>
      )}
    </div>
  );
}

function SpeciesCountRow({
  rank,
  entry,
  onViewPhenology,
}: {
  rank: number;
  entry: SpeciesCountEntry;
  onViewPhenology?: () => void;
}) {
  const { taxon, count } = entry;
  const photoUrl = taxon.default_photo?.square_url ?? null;

  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-3 py-2.5 hover:border-primary/30 transition-colors">
      <span className="w-8 text-right text-xs font-mono text-muted-foreground/60 shrink-0">
        #{rank}
      </span>

      <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-muted border border-border">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={taxon.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium italic text-foreground truncate">{taxon.name}</p>
        {taxon.preferred_common_name && (
          <p className="text-xs text-muted-foreground not-italic truncate">{taxon.preferred_common_name}</p>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {count.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">obs</span>
      </div>

      <div className="shrink-0 flex items-center gap-1">
        {onViewPhenology && (
          <button
            onClick={onViewPhenology}
            title="View phenology for this taxon"
            className="px-2 py-1 rounded-md text-xs text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
          >
            Phenology →
          </button>
        )}
        <a
          href={`https://www.inaturalist.org/taxa/${taxon.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
          title="View on iNaturalist"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

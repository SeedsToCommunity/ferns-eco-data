import { useState } from "react";
import { useApiGet } from "@/hooks/useApiGet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ExternalLink } from "lucide-react";

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
  preloadedPlaceName?: string;
  onTaxonSelected?: (taxonId: number, taxonName: string) => void;
}

export function LookupTab({ preloadedTaxonId, onTaxonSelected }: Props) {
  const [activePanel, setActivePanel] = useState<"autocomplete" | "taxon" | "place" | "nearby" | "terms">("autocomplete");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {(["autocomplete", "taxon", "place", "nearby", "terms"] as const).map((panel) => (
          <button
            key={panel}
            onClick={() => setActivePanel(panel)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
              activePanel === panel
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/70"
            }`}
          >
            {panel === "autocomplete" ? "Taxon Search" :
             panel === "taxon" ? "Taxon by ID" :
             panel === "place" ? "Place by ID" :
             panel === "nearby" ? "Places Nearby" :
             "Controlled Terms"}
          </button>
        ))}
      </div>

      {activePanel === "autocomplete" && <TaxonAutocompletePanel onTaxonSelected={onTaxonSelected} />}
      {activePanel === "taxon" && <TaxonByIdPanel preloadedTaxonId={preloadedTaxonId} />}
      {activePanel === "place" && <PlaceByIdPanel />}
      {activePanel === "nearby" && <PlacesNearbyPanel />}
      {activePanel === "terms" && <ControlledTermsPanel />}
    </div>
  );
}

function TaxonAutocompletePanel({ onTaxonSelected }: { onTaxonSelected?: (taxonId: number, taxonName: string) => void }) {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [perPage, setPerPage] = useState(10);

  const url = submitted ? apiUrl("/api/inat/taxa/autocomplete", { q: submitted, per_page: perPage }) : null;
  const { data, loading, error } = useApiGet<{
    found: boolean;
    data: { total_results: number; results: Array<{
      id: number; name: string; rank: string; preferred_common_name?: string;
      default_photo?: { square_url?: string; medium_url?: string };
      observations_count?: number;
    }> };
  }>(url);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) setSubmitted(q.trim());
  }

  const results = data?.data?.results ?? [];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="ac-q" className="text-xs mb-1 block">Search by name</Label>
          <Input
            id="ac-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Trillium grand"
            className="h-8 text-sm"
          />
        </div>
        <div className="w-20">
          <Label className="text-xs mb-1 block">Per page</Label>
          <Input
            type="number"
            value={perPage}
            onChange={(e) => setPerPage(Math.min(10, Math.max(1, Number(e.target.value))))}
            className="h-8 text-sm"
            min={1} max={10}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" size="sm" className="h-8" disabled={!q.trim() || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
      </form>

      {error && <p className="text-xs text-destructive">Error: {error}</p>}

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{data?.data?.total_results ?? 0} total matches — showing {results.length}</p>
          {results.map((r) => {
            const photoUrl = r.default_photo?.square_url ?? r.default_photo?.medium_url;
            return (
              <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                {photoUrl ? (
                  <img src={photoUrl} alt={r.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground text-xs">?</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium italic truncate">{r.name}</p>
                  {r.preferred_common_name && <p className="text-xs text-muted-foreground truncate">{r.preferred_common_name}</p>}
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">{r.rank}</Badge>
                    {r.observations_count !== undefined && (
                      <span className="text-xs text-muted-foreground">{r.observations_count.toLocaleString()} obs</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {onTaxonSelected && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2"
                      onClick={() => onTaxonSelected(r.id, r.name)}
                    >
                      Pin
                    </Button>
                  )}
                  <a
                    href={`https://www.inaturalist.org/taxa/${r.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 h-7 rounded text-xs border border-border bg-muted hover:bg-muted/70 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {submitted && !loading && results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground text-center py-4">No results for "{submitted}"</p>
      )}
    </div>
  );
}

function TaxonByIdPanel({ preloadedTaxonId }: { preloadedTaxonId?: number | null }) {
  const [taxonIdInput, setTaxonIdInput] = useState(preloadedTaxonId ? String(preloadedTaxonId) : "");
  const [submittedId, setSubmittedId] = useState<number | null>(preloadedTaxonId ?? null);

  const url = submittedId !== null ? apiUrl(`/api/inat/taxon/${submittedId}`, {}) : null;
  const { data, loading, error } = useApiGet<{
    found: boolean;
    cache_status?: string;
    data: {
      results?: Array<{
        id: number;
        name: string;
        rank: string;
        preferred_common_name?: string;
        wikipedia_summary?: string;
        wikipedia_url?: string;
        default_photo?: { medium_url?: string };
        observations_count?: number;
        conservation_status?: { status: string; status_name: string };
        listed_taxa?: Array<{ place?: { display_name?: string }; establishment_means?: string; occurrence_status?: string }>;
      }>;
    };
  }>(url);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(taxonIdInput);
    if (n > 0) setSubmittedId(n);
  }

  const taxon = data?.data?.results?.[0];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="tid-input" className="text-xs mb-1 block">Taxon ID</Label>
          <Input
            id="tid-input"
            value={taxonIdInput}
            onChange={(e) => setTaxonIdInput(e.target.value)}
            placeholder="e.g. 50153"
            className="h-8 text-sm"
            type="number"
            min={1}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" size="sm" className="h-8" disabled={!taxonIdInput || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
          </Button>
        </div>
      </form>

      {error && <p className="text-xs text-destructive">Error: {error}</p>}

      {taxon && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
            {taxon.default_photo?.medium_url && (
              <img src={taxon.default_photo.medium_url} alt={taxon.name} className="w-16 h-16 rounded object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold italic">{taxon.name}</h3>
                <Badge variant="outline" className="text-xs">{taxon.rank}</Badge>
                {data?.cache_status && (
                  <Badge variant="secondary" className="text-xs">cache: {data.cache_status}</Badge>
                )}
              </div>
              {taxon.preferred_common_name && <p className="text-xs text-muted-foreground mb-1">{taxon.preferred_common_name}</p>}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>ID: {taxon.id}</span>
                {taxon.observations_count !== undefined && <span>{taxon.observations_count.toLocaleString()} obs</span>}
                {taxon.conservation_status && (
                  <Badge variant="destructive" className="text-xs">{taxon.conservation_status.status_name}</Badge>
                )}
              </div>
              {taxon.wikipedia_url && (
                <a href={taxon.wikipedia_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1">
                  Wikipedia <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {taxon.wikipedia_summary && (
            <div className="p-3 rounded-lg border border-border bg-muted/30">
              <p className="text-xs font-medium mb-1">Wikipedia Summary</p>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{taxon.wikipedia_summary}</p>
            </div>
          )}

          {taxon.listed_taxa && taxon.listed_taxa.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-2">Nativity (listed_taxa — {taxon.listed_taxa.length} entries)</p>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left px-2 py-1.5 font-medium">Place</th>
                      <th className="text-left px-2 py-1.5 font-medium">Establishment</th>
                      <th className="text-left px-2 py-1.5 font-medium">Occurrence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxon.listed_taxa.map((lt, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-2 py-1">{lt.place?.display_name ?? "—"}</td>
                        <td className="px-2 py-1">
                          <Badge
                            variant={lt.establishment_means === "native" ? "default" : lt.establishment_means === "introduced" ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {lt.establishment_means ?? "—"}
                          </Badge>
                        </td>
                        <td className="px-2 py-1 text-muted-foreground">{lt.occurrence_status ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {submittedId !== null && !loading && !taxon && !error && (
        <p className="text-sm text-muted-foreground text-center py-4">No taxon found for ID {submittedId}</p>
      )}
    </div>
  );
}

function PlaceByIdPanel() {
  const [placeIdInput, setPlaceIdInput] = useState("");
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  const url = submittedId !== null ? apiUrl(`/api/inat/place/${submittedId}`, {}) : null;
  const { data, loading, error } = useApiGet<{
    found: boolean;
    cache_status?: string;
    data: {
      results?: Array<{
        id: number;
        name?: string;
        display_name?: string;
        place_type?: number;
        location?: string;
        admin_level?: number;
        bbox_area?: number;
        ancestry?: string;
      }>;
    };
  }>(url);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(placeIdInput);
    if (n > 0) setSubmittedId(n);
  }

  const place = data?.data?.results?.[0];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="pid-input" className="text-xs mb-1 block">Place ID</Label>
          <Input
            id="pid-input"
            value={placeIdInput}
            onChange={(e) => setPlaceIdInput(e.target.value)}
            placeholder="e.g. 2649 (Washtenaw Co)"
            className="h-8 text-sm"
            type="number"
            min={1}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" size="sm" className="h-8" disabled={!placeIdInput || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
          </Button>
        </div>
      </form>

      {error && <p className="text-xs text-destructive">Error: {error}</p>}

      {place && (
        <div className="p-3 rounded-lg border border-border bg-card space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">{place.display_name ?? place.name ?? `Place ${place.id}`}</h3>
            {data?.cache_status && (
              <Badge variant="secondary" className="text-xs">cache: {data.cache_status}</Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div><span className="text-muted-foreground">ID:</span> {place.id}</div>
            {place.place_type !== undefined && <div><span className="text-muted-foreground">Type:</span> {place.place_type}</div>}
            {place.admin_level !== undefined && <div><span className="text-muted-foreground">Admin level:</span> {place.admin_level}</div>}
            {place.location && <div><span className="text-muted-foreground">Centroid:</span> {place.location}</div>}
            {place.bbox_area !== undefined && <div><span className="text-muted-foreground">BBox area:</span> {place.bbox_area.toFixed(4)}</div>}
            {place.ancestry && <div className="col-span-2"><span className="text-muted-foreground">Ancestry:</span> {place.ancestry}</div>}
          </div>
          <a
            href={`https://www.inaturalist.org/places/${place.id}`}
            target="_blank" rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            View on iNaturalist <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {submittedId !== null && !loading && !place && !error && (
        <p className="text-sm text-muted-foreground text-center py-4">No place found for ID {submittedId}</p>
      )}
    </div>
  );
}

function PlacesNearbyPanel() {
  const [nelat, setNelat] = useState("");
  const [nelng, setNelng] = useState("");
  const [swlat, setSwlat] = useState("");
  const [swlng, setSwlng] = useState("");
  const [submitted, setSubmitted] = useState<{nelat: string; nelng: string; swlat: string; swlng: string} | null>(null);

  const url = submitted
    ? apiUrl("/api/inat/places/nearby", { nelat: submitted.nelat, nelng: submitted.nelng, swlat: submitted.swlat, swlng: submitted.swlng })
    : null;
  const { data, loading, error } = useApiGet<{
    found: boolean;
    data: {
      results?: {
        standard?: Array<{ id: number; display_name?: string; name?: string; place_type?: number }>;
        community?: Array<{ id: number; display_name?: string; name?: string; place_type?: number }>;
      };
    };
  }>(url);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nelat && nelng && swlat && swlng) setSubmitted({ nelat, nelng, swlat, swlng });
  }

  const standard = data?.data?.results?.standard ?? [];
  const community = data?.data?.results?.community ?? [];

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Example: Washtenaw County, MI — NE: 42.45, -83.5 / SW: 42.12, -84.1</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs mb-1 block">NE Latitude</Label>
          <Input value={nelat} onChange={(e) => setNelat(e.target.value)} placeholder="42.45" className="h-8 text-sm" />
        </div>
        <div>
          <Label className="text-xs mb-1 block">NE Longitude</Label>
          <Input value={nelng} onChange={(e) => setNelng(e.target.value)} placeholder="-83.5" className="h-8 text-sm" />
        </div>
        <div>
          <Label className="text-xs mb-1 block">SW Latitude</Label>
          <Input value={swlat} onChange={(e) => setSwlat(e.target.value)} placeholder="42.12" className="h-8 text-sm" />
        </div>
        <div>
          <Label className="text-xs mb-1 block">SW Longitude</Label>
          <Input value={swlng} onChange={(e) => setSwlng(e.target.value)} placeholder="-84.1" className="h-8 text-sm" />
        </div>
        <div className="col-span-2">
          <Button type="submit" size="sm" className="h-8 w-full" disabled={!nelat || !nelng || !swlat || !swlng || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Search Places Nearby
          </Button>
        </div>
      </form>

      {error && <p className="text-xs text-destructive">Error: {error}</p>}

      {(standard.length > 0 || community.length > 0) && (
        <div className="space-y-3">
          {standard.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1">Standard (admin) places — {standard.length}</p>
              <div className="space-y-1">
                {standard.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-2 py-1.5 rounded border border-border bg-muted/20 text-xs">
                    <span>{p.display_name ?? p.name ?? `Place ${p.id}`}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">ID: {p.id}</span>
                      <a href={`https://www.inaturalist.org/places/${p.id}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 text-primary" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {community.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1">Community places — {community.length}</p>
              <div className="space-y-1">
                {community.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-2 py-1.5 rounded border border-border bg-muted/20 text-xs">
                    <span>{p.display_name ?? p.name ?? `Place ${p.id}`}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">ID: {p.id}</span>
                      <a href={`https://www.inaturalist.org/places/${p.id}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 text-primary" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {submitted && !loading && standard.length === 0 && community.length === 0 && !error && (
        <p className="text-sm text-muted-foreground text-center py-4">No places found in that bounding box</p>
      )}
    </div>
  );
}

function ControlledTermsPanel() {
  const url = apiUrl("/api/inat/controlled-terms", {});
  const { data, loading, error } = useApiGet<{
    found: boolean;
    cache_status?: string;
    data: {
      results?: Array<{
        id: number;
        label: string;
        values?: Array<{ id: number; label: string; blocking?: boolean }>;
        taxon_ids?: number[];
      }>;
    };
  }>(url);

  const terms = data?.data?.results ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Reference table of all iNaturalist controlled annotation term IDs and value IDs</p>
        {data?.cache_status && <Badge variant="secondary" className="text-xs">cache: {data.cache_status}</Badge>}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && <p className="text-xs text-destructive">Error: {error}</p>}

      {terms.map((term) => (
        <div key={term.id} className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-3 py-2 bg-muted/30 border-b border-border flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">term_id={term.id}</Badge>
            <span className="text-sm font-medium">{term.label}</span>
            {term.taxon_ids && term.taxon_ids.length > 0 && (
              <span className="text-xs text-muted-foreground ml-auto">{term.taxon_ids.length} taxa</span>
            )}
          </div>
          {term.values && term.values.length > 0 && (
            <table className="w-full text-xs">
              <thead className="bg-muted/10">
                <tr>
                  <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">term_value_id</th>
                  <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Label</th>
                  <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Blocking</th>
                </tr>
              </thead>
              <tbody>
                {term.values.map((v) => (
                  <tr key={v.id} className="border-t border-border">
                    <td className="px-3 py-1.5 font-mono text-primary">{v.id}</td>
                    <td className="px-3 py-1.5">{v.label}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{v.blocking ? "yes" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

import { useState, lazy, Suspense } from "react";
import {
  useGetGbifOccurrences,
  getGetGbifOccurrencesQueryKey,
  type GetGbifOccurrencesParams,
  GetGbifOccurrencesContinent,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, MapPin, RefreshCw, ExternalLink, Globe2 } from "lucide-react";
import { formatNumber, cn } from "@/lib/utils";
import { format } from "date-fns";
import { RawJsonPanel } from "@/components/RawJsonPanel";

const BboxMapPicker = lazy(() =>
  import("./BboxMapPicker").then((m) => ({ default: m.BboxMapPicker })),
);

interface OccurrencesPanelProps {
  usageKey: number;
}

interface GbifOccurrence {
  key?: number;
  decimalLatitude?: number;
  decimalLongitude?: number;
  country?: string;
  stateProvince?: string;
  county?: string;
  eventDate?: string;
  year?: number;
  basisOfRecord?: string;
  institutionCode?: string;
  datasetName?: string;
  [key: string]: unknown;
}

type GeoMode = "all" | "country" | "continent" | "bbox";

interface BboxValues {
  minLat: string;
  minLon: string;
  maxLat: string;
  maxLon: string;
}

const COUNTRY_OPTIONS = [
  { value: "US", label: "United States (US)" },
  { value: "CA", label: "Canada (CA)" },
  { value: "MX", label: "Mexico (MX)" },
  { value: "GB", label: "United Kingdom (GB)" },
  { value: "AU", label: "Australia (AU)" },
  { value: "DE", label: "Germany (DE)" },
  { value: "ZA", label: "South Africa (ZA)" },
  { value: "BR", label: "Brazil (BR)" },
];

const CONTINENT_VALUES = Object.values(GetGbifOccurrencesContinent);

export function OccurrencesPanel({ usageKey }: OccurrencesPanelProps) {
  const [geoMode, setGeoMode] = useState<GeoMode>("all");
  const [country, setCountry] = useState<string>("US");
  const [continent, setContinent] = useState<GetGbifOccurrencesContinent>(GetGbifOccurrencesContinent.NORTH_AMERICA);
  const [bbox, setBbox] = useState<BboxValues>({
    minLat: "24.4",
    minLon: "-125.0",
    maxLat: "49.4",
    maxLon: "-66.9",
  });

  const [hasTriggered, setHasTriggered] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const baseParams: GetGbifOccurrencesParams = {
    taxonKey: usageKey,
    hasCoordinate: true,
    hasGeospatialIssue: false,
    limit: 20,
  };

  const geoParams: Record<string, unknown> = {};
  if (geoMode === "country") {
    geoParams.country = country;
  } else if (geoMode === "continent") {
    geoParams.continent = continent;
  } else if (geoMode === "bbox") {
    const minLat = parseFloat(bbox.minLat);
    const maxLat = parseFloat(bbox.maxLat);
    const minLon = parseFloat(bbox.minLon);
    const maxLon = parseFloat(bbox.maxLon);
    if (!isNaN(minLat) && !isNaN(maxLat) && !isNaN(minLon) && !isNaN(maxLon)) {
      geoParams.decimalLatitude = `${minLat},${maxLat}`;
      geoParams.decimalLongitude = `${minLon},${maxLon}`;
    }
  }

  const queryParams = {
    ...baseParams,
    ...geoParams,
    ...(refreshToggle ? { refresh: true } : {}),
  } as GetGbifOccurrencesParams;

  const occQuery = useGetGbifOccurrences(queryParams, {
    query: { queryKey: getGetGbifOccurrencesQueryKey(queryParams), enabled: hasTriggered },
  });

  const handleFetch = () => {
    setRefreshToggle(false);
    setHasTriggered(true);
    if (hasTriggered) {
      occQuery.refetch();
    }
  };

  const handleRefresh = () => {
    setRefreshToggle(true);
    setTimeout(() => occQuery.refetch(), 0);
  };

  const occData = occQuery.data?.data as Record<string, unknown> | undefined;
  const occCount = occData?.count as number | undefined;
  const occResults = (occData?.results as GbifOccurrence[] | undefined) ?? [];
  const cacheStatus = occQuery.data?.provenance?.cache_status;
  const sourceUrl = occQuery.data?.provenance?.source_url;

  return (
    <Card className="mt-8 border-primary/20 overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/50 pb-5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Map className="w-5 h-5 text-primary" />
          Occurrence Data
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Configure geographic bounds and fetch georeferenced records via GBIF's native occurrence search.
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="bg-card border border-border rounded-xl p-5 mb-6 shadow-sm">
          <h4 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-primary" />
            Geography Filter
          </h4>

          <div className="flex flex-wrap gap-4 mb-6">
            {(["all", "country", "continent", "bbox"] as GeoMode[]).map((mode) => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="geoMode"
                  checked={geoMode === mode}
                  onChange={() => setGeoMode(mode)}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <span className="text-sm font-medium capitalize">
                  {mode === "all" ? "Global (no filter)" : mode === "bbox" ? "Bounding Box" : mode}
                </span>
              </label>
            ))}
          </div>

          <div className="pl-6 border-l-2 border-border/50">
            {geoMode === "country" && (
              <select
                className="h-11 w-full max-w-xs rounded-xl border-2 border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {COUNTRY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}

            {geoMode === "continent" && (
              <select
                className="h-11 w-full max-w-xs rounded-xl border-2 border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
                value={continent}
                onChange={(e) => setContinent(e.target.value as GetGbifOccurrencesContinent)}
              >
                {CONTINENT_VALUES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            )}

            {geoMode === "bbox" && (
              <div className="space-y-4">
                <Suspense
                  fallback={
                    <div className="h-[280px] rounded-xl border border-border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                      Loading map…
                    </div>
                  }
                >
                  <BboxMapPicker bbox={bbox} onChange={setBbox} />
                </Suspense>
                <p className="text-xs text-muted-foreground">
                  Bbox is sent as GBIF native <code>decimalLatitude</code> and <code>decimalLongitude</code> range params.
                </p>
              </div>
            )}

            {geoMode === "all" && (
              <p className="text-sm text-muted-foreground">No geography filter — returns global occurrences.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
            <Button onClick={handleFetch} disabled={occQuery.isFetching} className="gap-2">
              {occQuery.isFetching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {hasTriggered ? "Update Occurrences" : "Fetch Occurrences"}
            </Button>
          </div>
        </div>

        {occQuery.isError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl mb-6">
            Failed to fetch occurrences: {occQuery.error?.message}
          </div>
        )}

        {hasTriggered && occData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
              <div>
                <h3 className="text-3xl font-display font-bold text-foreground">
                  {occCount !== undefined ? formatNumber(occCount) : "—"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Total occurrences matched
                  {geoMode !== "all" && (
                    <span className="ml-1">
                      · <span className="font-medium capitalize">{geoMode}</span>
                      {geoMode === "country" && ` = ${country}`}
                      {geoMode === "continent" && ` = ${continent.replace(/_/g, " ")}`}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <div className="flex items-center gap-2">
                  {cacheStatus && <Badge variant="outline">{cacheStatus}</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  {sourceUrl && (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded-md border border-border bg-background hover:bg-muted/50 transition-colors font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      GBIF API source
                    </a>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={occQuery.isFetching}
                    className="h-8 text-xs"
                  >
                    <RefreshCw className={cn("w-3 h-3 mr-1.5", occQuery.isFetching && "animate-spin")} />
                    Bypass Cache
                  </Button>
                </div>
              </div>
            </div>

            {occResults.length > 0 ? (
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Location</th>
                        <th className="px-4 py-3 font-semibold">Basis</th>
                        <th className="px-4 py-3 font-semibold">Institution</th>
                        <th className="px-4 py-3 font-semibold">Coordinates</th>
                        <th className="px-4 py-3 font-semibold text-right">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {occResults.slice(0, 20).map((occ, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {occ.eventDate
                              ? format(new Date(occ.eventDate), "yyyy-MM-dd")
                              : occ.year || "Unknown"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{occ.country || "—"}</div>
                            <div className="text-xs text-muted-foreground">
                              {[occ.stateProvince, occ.county].filter(Boolean).join(", ")}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {occ.basisOfRecord && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] whitespace-nowrap"
                              >
                                {occ.basisOfRecord.replace(/_/g, " ")}
                              </Badge>
                            )}
                          </td>
                          <td
                            className="px-4 py-3 text-xs max-w-[150px] truncate"
                            title={occ.institutionCode || occ.datasetName || "Unknown"}
                          >
                            {occ.institutionCode || occ.datasetName || "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {occ.decimalLatitude !== undefined && occ.decimalLongitude !== undefined
                              ? `${occ.decimalLatitude.toFixed(4)}, ${occ.decimalLongitude.toFixed(4)}`
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {occ.key && (
                              <a
                                href={`https://www.gbif.org/occurrence/${occ.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex p-1.5 hover:bg-muted rounded text-primary transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {occResults.length > 20 && (
                  <div className="px-4 py-3 text-center border-t border-border bg-muted/20 text-xs text-muted-foreground">
                    Showing 20 of {occResults.length} fetched records (total matched: {occCount !== undefined ? formatNumber(occCount) : "?"}).
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-muted/10">
                No occurrence records returned for this query.
              </div>
            )}

            <RawJsonPanel title="Occurrences Response" data={occQuery.data} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

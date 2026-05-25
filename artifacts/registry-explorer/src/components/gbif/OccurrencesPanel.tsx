import { useState, lazy, Suspense, useCallback } from "react";
import {
  useGetGbifOccurrences,
  getGetGbifOccurrencesQueryKey,
  type GetGbifOccurrencesParams,
  GetGbifOccurrencesContinent,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, MapPin, RefreshCw, ExternalLink, Globe2, ChevronLeft, ChevronRight } from "lucide-react";
import { formatNumber, cn } from "@/lib/utils";
import { format } from "date-fns";
import { RawJsonPanel } from "@/components/RawJsonPanel";
import type { GbifBboxParams } from "./BboxMapPicker";

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
const PAGE_SIZE = 20;

export function OccurrencesPanel({ usageKey }: OccurrencesPanelProps) {
  const [geoMode, setGeoMode] = useState<GeoMode>("all");
  const [country, setCountry] = useState<string>("US");
  const [continent, setContinent] = useState<GetGbifOccurrencesContinent>(GetGbifOccurrencesContinent.NORTH_AMERICA);
  const [gbifBbox, setGbifBbox] = useState<GbifBboxParams>({
    decimalLatitude: "24.4,49.4",
    decimalLongitude: "-125.0,-66.9",
  });

  const [offset, setOffset] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const resetOffset = useCallback(() => setOffset(0), []);

  const handleGeoModeChange = (mode: GeoMode) => {
    setGeoMode(mode);
    resetOffset();
  };

  const handleCountryChange = (val: string) => {
    setCountry(val);
    resetOffset();
  };

  const handleContinentChange = (val: GetGbifOccurrencesContinent) => {
    setContinent(val);
    resetOffset();
  };

  const handleBboxChange = (params: GbifBboxParams) => {
    setGbifBbox(params);
    resetOffset();
  };

  const baseParams: GetGbifOccurrencesParams = {
    taxonKey: usageKey,
    hasCoordinate: true,
    hasGeospatialIssue: false,
    limit: PAGE_SIZE,
    offset,
  };

  const geoParams: Record<string, unknown> = {};
  if (geoMode === "country") {
    geoParams.country = country;
  } else if (geoMode === "continent") {
    geoParams.continent = continent;
  } else if (geoMode === "bbox") {
    geoParams.decimalLatitude = gbifBbox.decimalLatitude;
    geoParams.decimalLongitude = gbifBbox.decimalLongitude;
  }

  const queryParams = {
    ...baseParams,
    ...geoParams,
    ...(refreshFlag ? { refresh: true } : {}),
  } as GetGbifOccurrencesParams;

  const occQuery = useGetGbifOccurrences(queryParams, {
    query: { queryKey: getGetGbifOccurrencesQueryKey(queryParams), enabled: hasTriggered },
  });

  const handleFetch = () => {
    setRefreshFlag(false);
    if (!hasTriggered) {
      setHasTriggered(true);
    } else {
      occQuery.refetch();
    }
  };

  const handleRefresh = () => {
    setRefreshFlag(true);
    setTimeout(() => occQuery.refetch(), 0);
  };

  const handlePrevPage = () => {
    setOffset((o) => Math.max(0, o - PAGE_SIZE));
  };

  const handleNextPage = () => {
    setOffset((o) => o + PAGE_SIZE);
  };

  const occData = occQuery.data?.data as Record<string, unknown> | undefined;
  const occCount = occData?.count as number | undefined;
  const occResults = (occData?.results as GbifOccurrence[] | undefined) ?? [];
  const endOfRecords = occData?.endOfRecords as boolean | undefined;
  const cacheStatus = occQuery.data?.provenance?.cache_status;
  const sourceUrl = occQuery.data?.provenance?.source_url;

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const hasPrev = offset > 0;
  const hasNext = endOfRecords === false || (occResults.length === PAGE_SIZE);

  return (
    <Card className="mt-8 border-primary/20 overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/50 pb-5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Map className="w-5 h-5 text-primary" />
          Occurrence Data
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Configure geographic bounds and fetch georeferenced records via GBIF native occurrence search.
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
                  onChange={() => handleGeoModeChange(mode)}
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
                onChange={(e) => handleCountryChange(e.target.value)}
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
                onChange={(e) => handleContinentChange(e.target.value as GetGbifOccurrencesContinent)}
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
                  <BboxMapPicker
                    defaultDecimalLatitude={gbifBbox.decimalLatitude}
                    defaultDecimalLongitude={gbifBbox.decimalLongitude}
                    onChange={handleBboxChange}
                  />
                </Suspense>
                <p className="text-xs text-muted-foreground">
                  GBIF native <code>decimalLatitude</code> and <code>decimalLongitude</code> range params are forwarded verbatim.
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
                      {occResults.map((occ, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {occ.eventDate
                              ? (() => {
                                  try { return format(new Date(occ.eventDate), "yyyy-MM-dd"); }
                                  catch { return String(occ.eventDate); }
                                })()
                              : (occ.year || "Unknown")}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{occ.country || "—"}</div>
                            <div className="text-xs text-muted-foreground">
                              {[occ.stateProvince, occ.county].filter(Boolean).join(", ")}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {occ.basisOfRecord && (
                              <Badge variant="secondary" className="text-[10px] whitespace-nowrap">
                                {occ.basisOfRecord.replace(/_/g, " ")}
                              </Badge>
                            )}
                          </td>
                          <td
                            className="px-4 py-3 text-xs max-w-[150px] truncate"
                            title={String(occ.institutionCode || occ.datasetName || "")}
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

                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    Page {currentPage} · offset {offset} · {occResults.length} records
                    {endOfRecords ? " · end of results" : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={!hasPrev || occQuery.isFetching}
                      className="h-7 text-xs gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!hasNext || occQuery.isFetching}
                      className="h-7 text-xs gap-1"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
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

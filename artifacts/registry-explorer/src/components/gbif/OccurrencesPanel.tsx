import { useState, lazy, Suspense } from "react";
import {
  useGetGbifOccurrences,
  getGetGbifOccurrencesQueryKey,
  type GbifOccurrenceRecord,
  type GetGbifOccurrencesParams,
  GetGbifOccurrencesContinent,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

type GeoMode = "countries" | "continent" | "bbox";

interface BboxValues {
  minLat: string;
  minLon: string;
  maxLat: string;
  maxLon: string;
}

type CountriesState = { US: boolean; CA: boolean; MX: boolean };

const CONTINENT_VALUES = Object.values(GetGbifOccurrencesContinent);

export function OccurrencesPanel({ usageKey }: OccurrencesPanelProps) {
  const [geoMode, setGeoMode] = useState<GeoMode>("countries");
  const [countries, setCountries] = useState<CountriesState>({ US: true, CA: true, MX: true });
  const [continent, setContinent] = useState<GetGbifOccurrencesContinent>(GetGbifOccurrencesContinent.NORTH_AMERICA);
  const [bbox, setBbox] = useState<BboxValues>({
    minLat: "24.4",
    minLon: "-125.0",
    maxLat: "49.4",
    maxLon: "-66.9",
  });

  const [hasTriggered, setHasTriggered] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const queryParams: GetGbifOccurrencesParams = { usageKey };

  if (geoMode === "countries") {
    const selected = (Object.entries(countries) as [keyof CountriesState, boolean][])
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",");
    if (selected) queryParams.countries = selected;
  } else if (geoMode === "continent") {
    queryParams.continent = continent;
  } else if (geoMode === "bbox") {
    queryParams.bbox = `${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon}`;
  }

  if (refreshToggle) {
    queryParams.refresh = true;
  }

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

  return (
    <Card className="mt-8 border-primary/20 overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/50 pb-5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Map className="w-5 h-5 text-primary" />
          Occurrence Data
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Configure geographic bounds and fetch recent georeferenced records. Records are filtered for
          valid coordinates and exclude known geospatial issues.
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Geography Configurator */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6 shadow-sm">
          <h4 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-primary" />
            Geography Filter
          </h4>

          <div className="flex flex-wrap gap-4 mb-6">
            {(["countries", "continent", "bbox"] as GeoMode[]).map((mode) => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="geoMode"
                  checked={geoMode === mode}
                  onChange={() => setGeoMode(mode)}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <span className="text-sm font-medium capitalize">
                  {mode === "bbox" ? "Bounding Box" : mode}
                </span>
              </label>
            ))}
          </div>

          <div className="pl-6 border-l-2 border-border/50">
            {geoMode === "countries" && (
              <div className="flex gap-4">
                {(["US", "CA", "MX"] as (keyof CountriesState)[]).map((code) => (
                  <label
                    key={code}
                    className="flex items-center gap-2 cursor-pointer bg-muted/50 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={countries[code]}
                      onChange={(e) => setCountries({ ...countries, [code]: e.target.checked })}
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span className="font-medium">{code}</span>
                  </label>
                ))}
              </div>
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
                {/* Numeric inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Min Lat</label>
                    <Input
                      value={bbox.minLat}
                      onChange={(e) => setBbox({ ...bbox, minLat: e.target.value })}
                      placeholder="e.g. 24.4"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Min Lon</label>
                    <Input
                      value={bbox.minLon}
                      onChange={(e) => setBbox({ ...bbox, minLon: e.target.value })}
                      placeholder="e.g. -125.0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Max Lat</label>
                    <Input
                      value={bbox.maxLat}
                      onChange={(e) => setBbox({ ...bbox, maxLat: e.target.value })}
                      placeholder="e.g. 49.4"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Max Lon</label>
                    <Input
                      value={bbox.maxLon}
                      onChange={(e) => setBbox({ ...bbox, maxLon: e.target.value })}
                      placeholder="e.g. -66.9"
                    />
                  </div>
                </div>

                {/* Leaflet Map */}
                <Suspense
                  fallback={
                    <div className="h-[280px] rounded-xl border border-border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                      Loading map…
                    </div>
                  }
                >
                  <BboxMapPicker bbox={bbox} onChange={setBbox} />
                </Suspense>
              </div>
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

        {/* Results Area */}
        {occQuery.isError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl mb-6">
            Failed to fetch occurrences: {occQuery.error?.message}
          </div>
        )}

        {hasTriggered && occQuery.data?.data && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
              <div>
                <h3 className="text-3xl font-display font-bold text-foreground">
                  {formatNumber(occQuery.data.data.occurrence_count)}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  Total occurrences for{" "}
                  <Badge variant="outline" className="font-mono bg-background">
                    {occQuery.data.data.geography_params}
                  </Badge>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{occQuery.data.data.cache_status}</Badge>
                  <span className="text-xs text-muted-foreground">
                    As of{" "}
                    {format(
                      new Date(occQuery.data.data.occurrence_last_fetched),
                      "MMM d, yyyy HH:mm",
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {occQuery.data.source_url && (
                    <a
                      href={occQuery.data.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded-md border border-border bg-background hover:bg-muted/50 transition-colors font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View all on GBIF
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
                    {occQuery.data.data.recent_occurrences.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-muted-foreground italic"
                        >
                          No recent records found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      occQuery.data.data.recent_occurrences.slice(0, 20).map((occ: GbifOccurrenceRecord, i: number) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {occ.eventDate
                              ? format(new Date(occ.eventDate), "yyyy-MM-dd")
                              : occ.year || "Unknown"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{occ.country}</div>
                            <div className="text-xs text-muted-foreground">
                              {[occ.stateProvince, occ.county].filter(Boolean).join(", ")}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="secondary"
                              className="text-[10px] whitespace-nowrap"
                            >
                              {occ.basisOfRecord.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td
                            className="px-4 py-3 text-xs max-w-[150px] truncate"
                            title={occ.institutionCode || occ.datasetName || "Unknown"}
                          >
                            {occ.institutionCode || occ.datasetName || "Unknown"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {occ.decimalLatitude.toFixed(4)}, {occ.decimalLongitude.toFixed(4)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <a
                              href={occ.gbifOccurrenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex p-1.5 hover:bg-muted rounded text-primary transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {occQuery.data.data.recent_occurrences.length > 20 && (
                <div className="px-4 py-3 text-center border-t border-border bg-muted/20 text-xs text-muted-foreground">
                  Showing 20 most recent records (of {occQuery.data.data.recent_occurrences.length} fetched).
                </div>
              )}
            </div>

            <RawJsonPanel title="Occurrences Response" data={occQuery.data} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

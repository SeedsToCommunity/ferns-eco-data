import { useState, useEffect } from "react";
import { useGetInatHistogram, useGetInatFieldValues } from "@workspace/api-client-react";
import { CalendarDays, Search, Loader2, AlertCircle, Plus, X, ExternalLink } from "lucide-react";
import { monthName, formatNumber } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { RawJsonPanel } from "@/components/RawJsonPanel";

const LEAF_STAGES = ["Green Leaves", "Colored Leaves", "No Live Leaves", "Breaking Leaf Buds"] as const;
const FLOWER_STAGES = ["Flowers", "Flower Buds", "Fruits or Seeds", "No Flowers or Fruits"] as const;

const STAGE_COLORS: Record<string, string> = {
  "Flowers": "#4ade80",
  "Flower Buds": "#86efac",
  "Fruits or Seeds": "#fb923c",
  "No Flowers or Fruits": "#d1d5db",
  "Green Leaves": "#22c55e",
  "Colored Leaves": "#f59e0b",
  "No Live Leaves": "#9ca3af",
  "Breaking Leaf Buds": "#84cc16",
};

function buildStageChartData(
  stages: readonly string[],
  phenByMonth: Record<string, Record<string, number>>,
): Array<{ month: string; monthNum: number } & Record<string, number>> {
  const allMonths = new Set<number>();
  for (const monthStr of Object.keys(phenByMonth)) {
    allMonths.add(Number(monthStr));
  }
  return Array.from(allMonths)
    .sort((a, b) => a - b)
    .map((monthNum) => {
      const monthData = phenByMonth[String(monthNum)] ?? {};
      const entry: { month: string; monthNum: number } & Record<string, number> = {
        month: monthName(monthNum),
        monthNum,
      };
      for (const stage of stages) {
        entry[stage] = monthData[stage] ?? 0;
      }
      return entry;
    })
    .filter((d) => stages.some((s) => (d[s] ?? 0) > 0));
}

interface PhenologyTabProps {
  preloadedTaxonId?: number | null;
  preloadedTaxonName?: string;
  preloadedPlaceId?: string;
  preloadedPlaceName?: string;
}

export function PhenologyTab({
  preloadedTaxonId,
  preloadedTaxonName,
  preloadedPlaceId,
  preloadedPlaceName,
}: PhenologyTabProps) {
  const [taxonId, setTaxonId] = useState(preloadedTaxonId ? String(preloadedTaxonId) : "");
  const [placeIds, setPlaceIds] = useState<string[]>(preloadedPlaceId ? [preloadedPlaceId] : [""]);
  const [submittedTaxon, setSubmittedTaxon] = useState("");
  const [submittedPlaceId, setSubmittedPlaceId] = useState("");

  useEffect(() => {
    if (preloadedTaxonId) {
      setTaxonId(String(preloadedTaxonId));
    }
  }, [preloadedTaxonId]);

  useEffect(() => {
    if (preloadedPlaceId) {
      setPlaceIds([preloadedPlaceId]);
    }
  }, [preloadedPlaceId]);

  const enabled = !!submittedTaxon && !!submittedPlaceId;

  const { data: histResponse, isLoading: histLoading, isError: histError, error: histErr } = useGetInatHistogram(
    {
      taxon_id: Number(submittedTaxon),
      place_id: submittedPlaceId,
    },
    { query: { enabled } }
  );

  const { data: fvResponse, isLoading: fvLoading, isError: fvError, error: fvErr } = useGetInatFieldValues(
    {
      taxon_id: Number(submittedTaxon),
      place_id: submittedPlaceId,
      verifiable: true,
    },
    { query: { enabled } }
  );

  const isLoading = histLoading || fvLoading;
  const isError = histError || fvError;
  const error = histErr ?? fvErr;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validPlaces = placeIds.map((p) => p.trim()).filter(Boolean);
    if (!taxonId.trim() || validPlaces.length === 0) return;
    setSubmittedTaxon(taxonId.trim());
    setSubmittedPlaceId(validPlaces.join(","));
  }

  function addPlace() {
    setPlaceIds((prev) => [...prev, ""]);
  }

  function removePlace(i: number) {
    setPlaceIds((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updatePlace(i: number, v: string) {
    setPlaceIds((prev) => prev.map((p, idx) => (idx === i ? v : p)));
  }

  function runQuickSearch(taxon: string, place: string) {
    setTaxonId(taxon);
    setPlaceIds([place]);
    setSubmittedTaxon(taxon);
    setSubmittedPlaceId(place);
  }

  const histData = histResponse?.data as Record<string, unknown> | undefined;
  const fvData = fvResponse?.data as Record<string, unknown> | undefined;

  const histResults = histData?.results as Record<string, unknown> | undefined;
  const rawObsByMonth = (histResults?.month_of_year as Record<string, number>) ?? {};
  const obsByMonth: Record<string, number> = {};
  for (const [k, v] of Object.entries(rawObsByMonth)) {
    if (typeof v === "number" && v > 0) obsByMonth[k] = v;
  }

  const monthlyData = Object.entries(obsByMonth)
    .map(([month, count]) => ({
      month: monthName(Number(month)),
      monthNum: Number(month),
      observations: count,
    }))
    .sort((a, b) => a.monthNum - b.monthNum);

  let peakMonth: number | null = null;
  let peakCount = -1;
  for (const [monthStr, count] of Object.entries(obsByMonth)) {
    if (count > peakCount) {
      peakCount = count;
      peakMonth = parseInt(monthStr, 10);
    }
  }

  const fvResults = (fvData?.results as Record<string, unknown>[]) ?? [];
  const phenByMonth: Record<string, Record<string, number>> = {};
  const stagesSet = new Set<string>();
  for (const result of fvResults) {
    const controlledValue = result.controlled_value as Record<string, unknown> | null;
    if (!controlledValue) continue;
    const stage = (controlledValue.label as string) || "";
    if (!stage) continue;
    stagesSet.add(stage);
    const monthOfYear = result.month_of_year as Record<string, number> | null;
    if (!monthOfYear) continue;
    for (const [monthStr, count] of Object.entries(monthOfYear)) {
      if (typeof count !== "number" || count === 0) continue;
      if (!phenByMonth[monthStr]) phenByMonth[monthStr] = {};
      phenByMonth[monthStr][stage] = (phenByMonth[monthStr][stage] ?? 0) + count;
    }
  }

  const stageTotals: Record<string, number> = {};
  for (const monthData of Object.values(phenByMonth)) {
    for (const [stage, count] of Object.entries(monthData)) {
      stageTotals[stage] = (stageTotals[stage] ?? 0) + count;
    }
  }

  const annotationsAvailable = stagesSet.size > 0;
  const hasResponse = !!(histResponse && fvResponse);
  const sourceUrl = histResponse?.source_url ?? fvResponse?.source_url;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Phenology</h2>
            <p className="text-xs text-muted-foreground">Monthly observation counts and phenological stage breakdown</p>
          </div>
        </div>

        {(preloadedTaxonId || preloadedPlaceId) && (
          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            {preloadedTaxonId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                Taxon from Species tab: {preloadedTaxonName || preloadedTaxonId}
              </span>
            )}
            {preloadedPlaceId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                Place from Lookup tab: {preloadedPlaceName || preloadedPlaceId}
              </span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Taxon ID</label>
            <input
              type="text"
              value={taxonId}
              onChange={(e) => setTaxonId(e.target.value)}
              placeholder="e.g. 54327 (Quercus rubra)"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-muted-foreground">Place ID(s)</label>
              <button
                type="button"
                onClick={addPlace}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add place
              </button>
            </div>
            <div className="space-y-2">
              {placeIds.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => updatePlace(i, e.target.value)}
                    placeholder="e.g. 2423"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {placeIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlace(i)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!taxonId.trim() || placeIds.every((p) => !p.trim()) || isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Load Phenology
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-3">
          Try:{" "}
          <button
            onClick={() => runQuickSearch("54327", "10")}
            className="underline text-primary hover:no-underline"
          >
            Red oak (54327) in Michigan (10)
          </button>
          {" • "}
          <button
            onClick={() => runQuickSearch("54327", "2423")}
            className="underline text-primary hover:no-underline"
          >
            Red oak in Washtenaw County (2423)
          </button>
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{(error as Error)?.message ?? "Failed to load phenology"}</span>
        </div>
      )}

      {hasResponse && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-sm">Monthly Observations</h3>
                {peakMonth !== null && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Peak month: {monthName(peakMonth)}
                  </p>
                )}
              </div>
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  View observations on iNaturalist
                </a>
              )}
            </div>
            <div className="p-6">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="observations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No monthly observation data available</p>
              )}
            </div>
          </div>

          {annotationsAvailable && Object.keys(stageTotals).length > 0 && (
            <>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                  <h3 className="font-semibold text-sm">Phenological Stages by Month</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Stage breakdown per month</p>
                </div>
                <div className="p-6 space-y-6">
                  <StageChart title="Flowering" stages={FLOWER_STAGES} phenByMonth={phenByMonth} />
                  <StageChart title="Leafing" stages={LEAF_STAGES} phenByMonth={phenByMonth} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                  <h3 className="font-semibold text-sm">Phenological Stage Totals</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Aggregated across all months</p>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <StageGroup title="Flowering" stages={FLOWER_STAGES} stageTotals={stageTotals} />
                  <StageGroup title="Leafing" stages={LEAF_STAGES} stageTotals={stageTotals} />
                </div>
              </div>
            </>
          )}

          {!annotationsAvailable && (
            <div className="bg-muted/30 border border-border rounded-xl p-4 text-sm text-muted-foreground">
              No phenological annotations recorded for this species in the selected places. Observation timing data is shown above.
            </div>
          )}

          <div className="flex gap-4 text-xs text-muted-foreground px-1">
            {histResponse?.cache_status && (
              <span>
                Histogram:{" "}
                <span className="capitalize px-1.5 py-0.5 rounded bg-muted border border-border">
                  {histResponse.cache_status}
                </span>
              </span>
            )}
            {fvResponse?.cache_status && (
              <span>
                Field values:{" "}
                <span className="capitalize px-1.5 py-0.5 rounded bg-muted border border-border">
                  {fvResponse.cache_status}
                </span>
              </span>
            )}
          </div>

          <RawJsonPanel title="iNat Histogram" data={histResponse} />
          <RawJsonPanel title="iNat Field Values" data={fvResponse} />
        </div>
      )}
    </div>
  );
}

function StageGroup({
  title,
  stages,
  stageTotals,
}: {
  title: string;
  stages: readonly string[];
  stageTotals: Record<string, number>;
}) {
  const groupTotal = stages.reduce((acc, s) => acc + (stageTotals[s] ?? 0), 0);

  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-2">
        {stages.map((stage) => {
          const count = stageTotals[stage] ?? 0;
          const pct = groupTotal > 0 ? (count / groupTotal) * 100 : 0;
          return (
            <div key={stage}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-foreground">{stage}</span>
                <span className="text-muted-foreground">{formatNumber(count)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: STAGE_COLORS[stage] ?? "hsl(var(--primary))",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StageChart({
  title,
  stages,
  phenByMonth,
}: {
  title: string;
  stages: readonly string[];
  phenByMonth: Record<string, Record<string, number>>;
}) {
  const chartData = buildStageChartData(stages, phenByMonth);
  if (chartData.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h4>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "11px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          {stages.map((stage, i) => (
            <Bar
              key={stage}
              dataKey={stage}
              stackId="a"
              fill={STAGE_COLORS[stage] ?? "hsl(var(--primary))"}
              radius={i === stages.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

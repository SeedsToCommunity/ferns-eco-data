import { useState } from "react";
import { useGetInatPhenology } from "@workspace/api-client-react";
import { CalendarDays, Search, Loader2, AlertCircle, Plus, X } from "lucide-react";
import { monthName, formatNumber } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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

export function PhenologyTab() {
  const [taxonId, setTaxonId] = useState("");
  const [placeIds, setPlaceIds] = useState<string[]>([""]);
  const [submittedTaxon, setSubmittedTaxon] = useState("");
  const [submittedPlaceId, setSubmittedPlaceId] = useState("");

  const enabled = !!submittedTaxon && !!submittedPlaceId;
  const { data: response, isLoading, isError, error } = useGetInatPhenology(
    {
      taxon_id: Number(submittedTaxon),
      place_id: submittedPlaceId,
    },
    { query: { enabled } }
  );

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

  const phenData = response?.data as Record<string, unknown> | undefined;

  const obsByMonth = phenData?.observations_by_month as Record<string, number> | undefined;
  const monthlyData = obsByMonth
    ? Object.entries(obsByMonth).map(([month, count]) => ({
        month: monthName(Number(month)),
        observations: count,
      }))
    : [];

  const phenByMonth = phenData?.phenology_by_month as Record<string, Record<string, number>> | undefined;

  const stageTotals: Record<string, number> = {};
  if (phenByMonth) {
    for (const monthData of Object.values(phenByMonth)) {
      for (const [stage, count] of Object.entries(monthData)) {
        stageTotals[stage] = (stageTotals[stage] ?? 0) + count;
      }
    }
  }

  const annotationsAvailable = phenData?.annotations_available as boolean | undefined;

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

      {response && phenData && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-sm">Monthly Observations</h3>
              {phenData.peak_observation_month !== null && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Peak month: {monthName(phenData.peak_observation_month as number)}
                </p>
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
                <p className="text-sm text-muted-foreground text-center py-8">No monthly data available</p>
              )}
            </div>
          </div>

          {annotationsAvailable && Object.keys(stageTotals).length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-sm">Phenological Stages</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Aggregated totals across all months</p>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StageGroup title="Flowering" stages={FLOWER_STAGES} stageTotals={stageTotals} />
                <StageGroup title="Leafing" stages={LEAF_STAGES} stageTotals={stageTotals} />
              </div>
            </div>
          )}

          {!annotationsAvailable && (
            <div className="bg-muted/30 border border-border rounded-xl p-4 text-sm text-muted-foreground">
              Phenological stage annotations are not available for this taxon and place combination.
            </div>
          )}

          <RawJsonPanel title="iNat Phenology" data={response} />
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

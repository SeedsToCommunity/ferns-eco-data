import React from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Loader2, ServerCrash, ArrowLeft, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetAllCoefficientValues,
  getGetAllCoefficientValuesQueryKey,
  useGetAllWetlandIndicators,
  getGetAllWetlandIndicatorsQueryKey,
  useGetAllWucols,
  getGetAllWucolsQueryKey,
} from "@workspace/api-client-react";

function DisambiguationNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{children}</p>
    </div>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <p className="text-sm text-foreground leading-relaxed">{children}</p>
    </div>
  );
}

function CoefficientTable() {
  const { data, isLoading, isError } = useGetAllCoefficientValues({
    query: { queryKey: getGetAllCoefficientValuesQueryKey() },
  });

  if (isLoading) return <Loader />;
  if (isError || !data?.data) return <ErrorState />;

  const entries = Array.isArray(data.data) ? data.data : [];

  return (
    <>
      <InfoNote>
        The Coefficient of Conservatism (C-value) is a Floristic Quality Assessment metric developed by Swink &amp; Wilhelm (1994). It rates a native plant species' fidelity to high-quality natural habitats on a scale of 0–10. Non-native species are assigned *.
      </InfoNote>
      <DisambiguationNote>
        C-value is <strong>not</strong> the Coefficient of Wetness (W, −5 to +5), which measures wetland habitat affinity. It is <strong>not</strong> a Wetland Indicator Status code (OBL/FACW/FAC/FACU/UPL). It is <strong>not</strong> a WUCOLS irrigation rating (VL/L/M/H).
      </DisambiguationNote>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground w-16">C-Value</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-48">Label</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Ecological Meaning</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-20">Native?</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.value} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-primary text-base">{entry.value}</span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{entry.short_label}</td>
                <td className="px-4 py-3 text-muted-foreground leading-relaxed">{entry.ecological_meaning}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${entry.is_native ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-secondary text-secondary-foreground"}`}>
                    {entry.is_native ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Authority: Swink, F. and G. Wilhelm. Plants of the Chicago Region, 4th ed. Indiana Academy of Science, 1994.</p>
    </>
  );
}

function WetlandIndicatorTable() {
  const { data, isLoading, isError } = useGetAllWetlandIndicators({
    query: { queryKey: getGetAllWetlandIndicatorsQueryKey() },
  });

  if (isLoading) return <Loader />;
  if (isError || !data?.data) return <ErrorState />;

  const entries = Array.isArray(data.data) ? data.data : [];

  return (
    <>
      <InfoNote>
        Wetland Indicator Status (WIS) codes classify plants by how often they occur in wetlands under natural conditions. Codes are assigned by the USDA NRCS National Wetland Plant List (NWPL) under U.S. Army Corps of Engineers authority. The Coefficient of Wetness (W-value) is the numeric companion used in Floristic Quality Assessment.
      </InfoNote>
      <DisambiguationNote>
        WIS codes are <strong>not</strong> WUCOLS ratings (VL/L/M/H). WIS describes where a plant grows in the wild. WUCOLS describes how much supplemental water a plant needs in a garden — entirely different systems. WIS is also <strong>not</strong> the Coefficient of Conservatism (C-value), which measures ecological fidelity, not wetland affinity.
      </DisambiguationNote>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground w-24">Code</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-12">W</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-48">Full Name</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-40">Occurrence in Wetlands</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Ecological Meaning</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.code} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-primary text-base">{entry.code}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono font-semibold text-foreground">{entry.w_value > 0 ? `+${entry.w_value}` : entry.w_value}</span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{entry.full_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{entry.occurrence_range}</td>
                <td className="px-4 py-3 text-muted-foreground leading-relaxed">{entry.ecological_meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Authority: USDA NRCS National Wetland Plant List (NWPL), U.S. Army Corps of Engineers. See: wetland-plants.usace.army.mil</p>
    </>
  );
}

function WucolsTable() {
  const { data, isLoading, isError } = useGetAllWucols({
    query: { queryKey: getGetAllWucolsQueryKey() },
  });

  if (isLoading) return <Loader />;
  if (isError || !data?.data) return <ErrorState />;

  const entries = Array.isArray(data.data) ? data.data : [];

  return (
    <>
      <InfoNote>
        WUCOLS (Water Use Classifications of Landscape Species) rates how much supplemental irrigation a plant needs in a managed landscape, expressed as a fraction of reference evapotranspiration (ETo). Developed by the UC Cooperative Extension.
      </InfoNote>
      <DisambiguationNote>
        WUCOLS is <strong>not</strong> the Wetland Indicator Status (OBL/FACW/FAC/FACU/UPL), which describes where a plant grows in the wild. WUCOLS is a gardening and irrigation planning tool — it says nothing about a plant's ecological behavior in natural habitats. It is also <strong>not</strong> the Coefficient of Conservatism (C-value, 0–10) or the Coefficient of Wetness (W, −5 to +5).
      </DisambiguationNote>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground w-20">Code</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-40">Water Use Level</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground w-36">ETo Range</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Irrigation Guidance</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.code} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-primary text-base">{entry.code}</span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{entry.full_name}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{entry.eto_range}</td>
                <td className="px-4 py-3 text-muted-foreground leading-relaxed">{entry.irrigation_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Authority: Costello, L.R. et al. WUCOLS IV. UC Cooperative Extension, 2014. ucanr.edu/sites/WUCOLS/</p>
    </>
  );
}

function Loader() {
  return (
    <div className="flex items-center gap-3 py-12 text-primary">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="text-muted-foreground">Loading reference data...</span>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex items-center gap-3 py-12 text-destructive">
      <ServerCrash className="w-6 h-6" />
      <span>Failed to load reference data from API.</span>
    </div>
  );
}

const VOCAB_CONFIG: Record<string, { title: string; subtitle: string; apiPath: string; component: React.FC }> = {
  coefficient: {
    title: "Coefficient of Conservatism",
    subtitle: "C-value reference — Floristic Quality Assessment (Swink & Wilhelm 1994)",
    apiPath: "/api/coefficient-of-conservatism/all",
    component: CoefficientTable,
  },
  "wetland-indicator": {
    title: "Wetland Indicator Status",
    subtitle: "WIS codes and Coefficient of Wetness (W) — USDA NRCS National Wetland Plant List",
    apiPath: "/api/wetland-indicator/all",
    component: WetlandIndicatorTable,
  },
  wucols: {
    title: "WUCOLS Water Use Classification",
    subtitle: "Landscape irrigation ratings — UC Cooperative Extension WUCOLS IV",
    apiPath: "/api/wucols/all",
    component: WucolsTable,
  },
};

export default function VocabularyPage() {
  const params = useParams<{ vocabulary: string }>();
  const vocabulary = params.vocabulary ?? "";
  const config = VOCAB_CONFIG[vocabulary];

  if (!config) {
    return (
      <Layout>
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-foreground mb-2">Unknown vocabulary reference</h2>
          <p className="text-muted-foreground mb-6">The requested vocabulary "{vocabulary}" was not found.</p>
          <Link href="/" className="text-primary hover:underline">← Back to registry</Link>
        </div>
      </Layout>
    );
  }

  const TableComponent = config.component;

  return (
    <Layout>
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to registry
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">{config.title}</h2>
          <p className="text-muted-foreground text-lg">{config.subtitle}</p>
        </motion.div>
      </div>

      <div className="mb-6 text-xs text-muted-foreground font-mono bg-muted/40 px-3 py-2 rounded-lg border border-border inline-flex gap-2 items-center">
        <span>API:</span>
        <a href={config.apiPath} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">{config.apiPath}</a>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TableComponent />
      </motion.div>
    </Layout>
  );
}

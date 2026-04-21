import React from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useGetSourcesIndex, getGetSourcesIndexQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import {
  ArrowLeft, ShieldCheck, ShieldOff, ExternalLink,
  Loader2, ServerCrash, BookOpen, Globe, FileText, Layers, Clock,
  Braces, Calendar, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-2 border-b border-border/40 last:border-0">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-40 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-foreground flex-1">{value}</span>
    </div>
  );
}

function PermissionBadge({ granted }: { granted: boolean }) {
  return granted ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-700 border border-green-500/20">
      <ShieldCheck className="w-3.5 h-3.5" /> Open / Permitted
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
      <ShieldOff className="w-3.5 h-3.5" /> Permission Required
    </span>
  );
}

function AttributionSection({ attribution }: { attribution: Record<string, string> }) {
  const labelMap: Record<string, string> = {
    source_name: "Source",
    maintainer: "Maintainer",
    organization: "Organization",
    website: "Website",
    napa_url: "NAPA URL",
    api_base_url: "API Base URL",
    license: "License",
    citation: "Citation",
    citation_napa: "Citation (NAPA)",
    citation_tdc: "Citation (TDC)",
    copyright_notice: "Copyright",
  };

  return (
    <Section title="Attribution" icon={<BookOpen className="w-4 h-4" />}>
      <div>
        {Object.entries(attribution).map(([k, v]) => (
          <KVRow
            key={k}
            label={labelMap[k] ?? k.replace(/_/g, " ")}
            value={
              typeof v === "string" && (v.startsWith("http://") || v.startsWith("https://")) ? (
                <a href={v} target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1 break-all">
                  {v} <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="break-words">{v}</span>
              )
            }
          />
        ))}
      </div>
    </Section>
  );
}

function BonapColorKeySection({ pageUrl }: { pageUrl?: string }) {
  const imgSrc = `${import.meta.env.BASE_URL}bonap-color-key.gif`;
  const sourceUrl = pageUrl ?? "http://www.bonap.org/MapKey.html";

  return (
    <Section title="Map Color Key" icon={<Layers className="w-4 h-4" />}>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <img
            src={imgSrc}
            alt="BONAP map color key showing all status categories: native, exotic, present, rare, adventive, waif, noxious, eradicated, extirpated, questionable, and not present"
            className="max-w-full rounded border border-border shadow-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground/80">
          Source:{" "}
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            {sourceUrl}
          </a>{" "}
          — BONAP's authoritative color key.{" "}
          <span>(Image cached locally — BONAP origin is HTTP-only.)</span>
        </p>
      </div>
    </Section>
  );
}

function VocabularySection({ vocabularies }: { vocabularies: Record<string, Array<{ code: string; label: string; description: string }>> }) {
  const vocabLabels: Record<string, string> = {
    basisOfRecord: "Basis of Record",
    matchType: "Match Type",
    taxonomicStatus: "Taxonomic Status",
    occurrenceStatus: "Occurrence Status",
    establishmentMeans: "Establishment Means",
    threatStatus: "Threat Status",
  };

  return (
    <Section title="Controlled Vocabularies" icon={<FileText className="w-4 h-4" />}>
      <div className="space-y-8">
        {Object.entries(vocabularies).map(([name, terms]) => (
          <div key={name}>
            <h3 className="text-sm font-bold text-foreground mb-3">
              {vocabLabels[name] ?? name.replace(/([A-Z])/g, " $1").trim()}
            </h3>
            <div className="space-y-2">
              {terms.map((term) => (
                <div key={term.code} className="flex gap-4 py-2 border-b border-border/40 last:border-0">
                  <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded h-fit shrink-0 w-36 truncate" title={term.code}>
                    {term.code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground block">{term.label}</span>
                    <span className="text-sm text-muted-foreground">{term.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProvenanceSection({ provenance }: { provenance: Record<string, string> }) {
  return (
    <Section title="Provenance" icon={<Clock className="w-4 h-4" />}>
      <div>
        {provenance.general_summary && (
          <KVRow label="Summary" value={provenance.general_summary} />
        )}
        {provenance.method && (
          <KVRow label="Method" value={<span className="font-mono text-xs bg-muted px-2 py-1 rounded">{provenance.method}</span>} />
        )}
        {provenance.upstream_url && (
          <KVRow label="Upstream" value={<span className="font-mono text-xs bg-muted px-2 py-1 rounded break-all">{provenance.upstream_url}</span>} />
        )}
        {provenance.fetched_at && (
          <KVRow label="Fetched At" value={new Date(provenance.fetched_at).toLocaleString()} />
        )}
        {provenance.technical_details && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scientific Method Note</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{provenance.technical_details}</p>
          </div>
        )}
      </div>
    </Section>
  );
}

function IdentitySection({
  serviceId, serviceName, dataVintage, queriedAt,
}: {
  serviceId?: string; serviceName?: string; dataVintage?: string; queriedAt?: string;
}) {
  return (
    <Section title="Identity" icon={<Globe className="w-4 h-4" />}>
      <div>
        {serviceName && <KVRow label="Name" value={<span className="font-semibold">{serviceName}</span>} />}
        {serviceId && <KVRow label="ID" value={<span className="font-mono text-xs bg-muted px-2 py-1 rounded">{serviceId}</span>} />}
        {dataVintage && <KVRow label="Data Vintage" value={dataVintage} />}
        {queriedAt && <KVRow label="Queried At" value={new Date(queriedAt).toLocaleString()} />}
      </div>
    </Section>
  );
}

export default function MetadataPage() {
  const { sourceId } = useParams<{ sourceId: string }>();

  const { data: sourcesData, isLoading: sourcesLoading } = useGetSourcesIndex({
    query: { queryKey: getGetSourcesIndexQueryKey() },
  });
  const source = sourcesData?.data?.sources?.find((s) => s.source_id === sourceId);

  // Use relative path so requests go through the Vite proxy instead of hitting
  // localhost:8080 directly (which is unreachable from the user's browser).
  const metadataUrl = source?.metadata_url;
  const metadataFetchPath = metadataUrl
    ? (() => { try { return new URL(metadataUrl).pathname; } catch { return metadataUrl; } })()
    : undefined;

  const { data: meta, isLoading: metaLoading, isError, error } = useQuery({
    queryKey: ["source-metadata", metadataUrl],
    enabled: !!metadataFetchPath,
    queryFn: async () => {
      const res = await fetch(metadataFetchPath!);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json() as Promise<Record<string, unknown>>;
    },
  });

  const isLoading = sourcesLoading;

  const unwrapped: Record<string, unknown> = (() => {
    if (!meta) return {};
    if ("found" in meta && "data" in meta) return meta as Record<string, unknown>;
    return meta;
  })();

  const isFernsEnvelope = meta && "found" in meta && "data" in meta;
  const innerData = isFernsEnvelope
    ? (meta.data as Record<string, unknown>)
    : null;
  const provenance = isFernsEnvelope
    ? (meta.provenance as Record<string, string> | undefined)
    : (meta?.provenance as Record<string, string> | undefined);

  const root = innerData ?? unwrapped;

  const serviceId = (root.service_id ?? root.source_id) as string | undefined;
  const serviceName = (root.service_name ?? root.name) as string | undefined;
  const dataVintage = root.data_vintage as string | undefined;
  const queriedAt = (unwrapped.queried_at ?? (innerData as Record<string, unknown> | null)?.updated_at) as string | undefined;
  const permissionGranted = root.permission_granted as boolean | undefined;
  const permissionStatus = root.permission_status as string | undefined;
  const attribution = root.attribution as Record<string, string> | undefined;
  const colorKey = root.color_key as Array<unknown> | undefined;
  const colorKeyUrl = root.color_key_url as string | undefined;
  const vocabularies = root.vocabularies as Record<string, Array<{ code: string; label: string; description: string }>> | undefined;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          All Sources
        </Link>

        {/* Loading registry data */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 text-primary">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">Loading metadata…</p>
          </div>
        )}

        {/* Source not registered */}
        {!isLoading && !source && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-10 text-center">
            <ServerCrash className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-destructive mb-2">Source not found</h2>
            <p className="text-muted-foreground">No source with ID <code className="font-mono">{sourceId}</code> is registered.</p>
          </div>
        )}

        {/* Source found — always render once registry data is loaded */}
        {!isLoading && source && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Page header */}
            <div className="mb-2">
              <div className="flex items-start gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
                    {serviceName ?? source.name}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Source metadata for{" "}
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                      {source.source_id}
                    </span>
                  </p>
                </div>
                {permissionGranted !== undefined && (
                  <div className="mt-1">
                    <PermissionBadge granted={permissionGranted} />
                  </div>
                )}
              </div>
            </div>

            {/* Source Profile: from registry data — always visible */}
            {(source.output_summary || source.update_frequency || source.known_limitations) && (
              <Section title="Source Profile" icon={<Braces className="w-4 h-4" />}>
                <div className="space-y-0">
                  {source.output_summary && (
                    <KVRow
                      label="Provides"
                      value={
                        <span className="flex items-start gap-2">
                          <Braces className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          {source.output_summary}
                        </span>
                      }
                    />
                  )}
                  {source.update_frequency && (
                    <KVRow
                      label="Update Frequency"
                      value={
                        <span className="flex items-start gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          {source.update_frequency}
                        </span>
                      }
                    />
                  )}
                  {source.known_limitations && (
                    <KVRow
                      label="Known Limitations"
                      value={
                        <span className="flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          {source.known_limitations}
                        </span>
                      }
                    />
                  )}
                </div>
              </Section>
            )}

            {/* Metadata endpoint: loading */}
            {metaLoading && (
              <div className="flex items-center gap-3 py-6 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading live metadata…
              </div>
            )}

            {/* Metadata endpoint: error */}
            {!metaLoading && isError && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 text-sm text-destructive">
                <ServerCrash className="w-5 h-5 mb-2" />
                <p className="font-semibold mb-1">Live metadata unavailable</p>
                <p className="text-muted-foreground font-normal">
                  {error instanceof Error ? error.message : "The metadata endpoint is unreachable."}
                </p>
              </div>
            )}

            {/* Metadata endpoint: content */}
            {!metaLoading && meta && (
              <>
                {/* Permission status */}
                {permissionStatus && (
                  <div className={`rounded-xl px-5 py-4 border text-sm leading-relaxed ${
                    permissionGranted
                      ? "bg-green-500/5 border-green-500/20 text-green-800"
                      : "bg-amber-500/5 border-amber-500/20 text-amber-800"
                  }`}>
                    {permissionStatus}
                  </div>
                )}

                {/* Identity */}
                {(serviceId || serviceName || dataVintage || queriedAt) && (
                  <IdentitySection
                    serviceId={serviceId}
                    serviceName={serviceName}
                    dataVintage={dataVintage}
                    queriedAt={queriedAt}
                  />
                )}

                {/* Attribution */}
                {attribution && <AttributionSection attribution={attribution} />}

                {/* Color key (BONAP) */}
                {colorKey && colorKey.length > 0 && (
                  <BonapColorKeySection pageUrl={colorKeyUrl} />
                )}

                {/* Vocabularies (GBIF) */}
                {vocabularies && Object.keys(vocabularies).length > 0 && (
                  <VocabularySection vocabularies={vocabularies} />
                )}

                {/* Provenance envelope */}
                {provenance && <ProvenanceSection provenance={provenance} />}
              </>
            )}

            {/* Raw endpoint link */}
            {source.metadata_url && (
              <div className="text-right">
                <a
                  href={source.metadata_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  View raw JSON <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

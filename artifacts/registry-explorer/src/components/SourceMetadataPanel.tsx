import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen, Clock, Globe, ExternalLink, ShieldCheck, ShieldOff,
  Loader2, ServerCrash, AlertCircle, FlaskConical,
} from "lucide-react";

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

const LICENSE_LABEL: Record<string, string> = {
  "cc0": "CC0",
  "cc-by": "CC BY",
  "cc-by-sa": "CC BY-SA",
  "cc-by-nc": "CC BY-NC",
  "proprietary": "Proprietary",
  "restricted": "Restricted",
};

function LicenseBadges({ licenses }: { licenses: string[] }) {
  const isRestricted = licenses.includes("proprietary") || licenses.includes("restricted");
  if (licenses.length === 0) return null;
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      {licenses.map((lic) => (
        <span
          key={lic}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isRestricted
              ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
              : "bg-green-500/10 text-green-700 border-green-500/20"
          }`}
        >
          {isRestricted
            ? <ShieldOff className="w-3.5 h-3.5" />
            : <ShieldCheck className="w-3.5 h-3.5" />}
          {LICENSE_LABEL[lic] ?? lic}
        </span>
      ))}
    </span>
  );
}

function LinkValue({ v }: { v: string }) {
  if (v.startsWith("http://") || v.startsWith("https://")) {
    return (
      <a href={v} target="_blank" rel="noopener noreferrer"
        className="text-primary hover:underline inline-flex items-center gap-1 break-all">
        {v} <ExternalLink className="w-3 h-3 shrink-0" />
      </a>
    );
  }
  return <span className="break-words">{v}</span>;
}

interface MetadataShape {
  service_id?: string;
  source_id?: string;
  service_name?: string;
  name?: string;
  data_vintage?: string;
  queried_at?: string;
  licenses?: string[];
  license_notes?: string;
  attribution?: Record<string, string>;
  provenance?: {
    fetched_at?: string;
    method?: string;
    upstream_url?: string;
    general_summary?: string;
    technical_details?: string;
  };
}

const ATTRIBUTION_LABELS: Record<string, string> = {
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

export function SourceMetadataPanel({ metadataApiPath }: { metadataApiPath: string }) {
  const { data: meta, isLoading, isError, error } = useQuery<MetadataShape>({
    queryKey: ["source-metadata-panel", metadataApiPath],
    queryFn: async () => {
      const res = await fetch(metadataApiPath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-8 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading source metadata…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 py-6 text-destructive/80 text-sm">
        <ServerCrash className="w-4 h-4" />
        Metadata unavailable: {error instanceof Error ? error.message : "unreachable"}
      </div>
    );
  }

  if (!meta) return null;

  const serviceId = meta.service_id ?? meta.source_id;
  const serviceName = meta.service_name ?? meta.name;
  const { data_vintage, queried_at, licenses, license_notes, attribution, provenance } = meta;
  const isRestricted = licenses?.includes("proprietary") || licenses?.includes("restricted");

  return (
    <div className="space-y-4">
      {/* License notes banner */}
      {license_notes && (
        <div className={`rounded-xl px-5 py-3 border text-sm leading-relaxed flex items-start gap-3 ${
          isRestricted
            ? "bg-amber-500/5 border-amber-500/20 text-amber-800"
            : "bg-green-500/5 border-green-500/20 text-green-800"
        }`}>
          {isRestricted
            ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            : <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />}
          <span>{license_notes}</span>
        </div>
      )}

      {/* Identity */}
      {(serviceId || serviceName || data_vintage || queried_at) && (
        <Section title="Identity" icon={<Globe className="w-4 h-4" />}>
          <div>
            {serviceName && <KVRow label="Name" value={<span className="font-semibold">{serviceName}</span>} />}
            {serviceId && <KVRow label="ID" value={<span className="font-mono text-xs bg-muted px-2 py-1 rounded">{serviceId}</span>} />}
            {data_vintage && <KVRow label="Data Vintage" value={data_vintage} />}
            {queried_at && <KVRow label="Queried At" value={new Date(queried_at).toLocaleString()} />}
            {licenses && licenses.length > 0 && (
              <KVRow label="Licenses" value={<LicenseBadges licenses={licenses} />} />
            )}
          </div>
        </Section>
      )}

      {/* Attribution */}
      {attribution && Object.keys(attribution).length > 0 && (
        <Section title="Attribution" icon={<BookOpen className="w-4 h-4" />}>
          <div>
            {Object.entries(attribution).map(([k, v]) => (
              <KVRow
                key={k}
                label={ATTRIBUTION_LABELS[k] ?? k.replace(/_/g, " ")}
                value={<LinkValue v={v} />}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Provenance */}
      {provenance && (provenance.method || provenance.upstream_url || provenance.fetched_at) && (
        <Section title="Provenance" icon={<Clock className="w-4 h-4" />}>
          <div>
            {provenance.method && (
              <KVRow label="Method" value={<span className="font-mono text-xs bg-muted px-2 py-1 rounded">{provenance.method}</span>} />
            )}
            {provenance.upstream_url && (
              <KVRow label="Upstream" value={<span className="font-mono text-xs bg-muted px-2 py-1 rounded break-all">{provenance.upstream_url}</span>} />
            )}
            {provenance.fetched_at && (
              <KVRow label="Fetched At" value={new Date(provenance.fetched_at).toLocaleString()} />
            )}
          </div>
        </Section>
      )}

      {/* Scientific Description */}
      {provenance?.technical_details && (
        <Section title="Scientific Description" icon={<FlaskConical className="w-4 h-4" />}>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {provenance.technical_details}
          </p>
        </Section>
      )}
    </div>
  );
}

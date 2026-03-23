import type { BonapMapResponse } from "@workspace/api-client-react";
import { Database, Clock, Fingerprint, Shield, Link as LinkIcon, Info } from "lucide-react";

export function ProvenancePanel({ response }: { response: BonapMapResponse }) {
  const prov = response.provenance;
  const meta = response.data;
  
  if (!prov || !meta) return null;

  return (
    <div className="bg-secondary/20 rounded-2xl border border-secondary p-6 md:p-8 space-y-8">
      
      {/* Top Meta Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Database className="w-4 h-4" /> Cache Status
          </div>
          <p className="text-foreground capitalize">{meta.cache_status}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Clock className="w-4 h-4" /> Queried At
          </div>
          <p className="text-foreground">{new Date(meta.queried_at).toLocaleString()}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Shield className="w-4 h-4" /> Permission
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${meta.permission_granted ? 'bg-primary' : 'bg-destructive'}`} />
            <p className={meta.permission_granted ? "text-foreground" : "text-destructive font-medium"}>
              {meta.permission_granted ? "Granted" : "Not Granted"}
            </p>
          </div>
        </div>
      </div>

      {/* Attribution Block */}
      <div className="space-y-4 pt-6 border-t border-border/50">
        <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-primary" /> Attribution
        </h3>
        <div className="grid gap-3 text-sm">
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <span className="text-muted-foreground font-medium">Source</span>
            <span className="text-foreground">{meta.attribution.source_name}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <span className="text-muted-foreground font-medium">Organization</span>
            <span className="text-foreground">{meta.attribution.organization}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <span className="text-muted-foreground font-medium">Maintainer</span>
            <span className="text-foreground">{meta.attribution.maintainer}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <span className="text-muted-foreground font-medium">Citation (NAPA)</span>
            <span className="text-foreground italic bg-background p-3 rounded-lg border">{meta.attribution.citation_napa}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <span className="text-muted-foreground font-medium">Citation (TDC)</span>
            <span className="text-foreground italic bg-background p-3 rounded-lg border">{meta.attribution.citation_tdc}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-4">
            <span className="text-muted-foreground font-medium">Copyright</span>
            <span className="text-foreground">{meta.attribution.copyright_notice}</span>
          </div>
        </div>
      </div>

      {/* FERNS Provenance */}
      <div className="space-y-4 pt-6 border-t border-border/50">
        <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" /> FERNS Provenance
        </h3>
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Derivation Summary:</strong> {prov.derivation_summary}
          </p>
          <div className="bg-background p-4 rounded-xl border space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Scientific Derivation</p>
            <p className="text-foreground/80 font-serif leading-relaxed text-[13px]">{prov.derivation_scientific}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5"/> Source ID: {prov.source_id}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Fetched: {new Date(prov.fetched_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5"/> Method: {prov.method}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

import { Database, Clock, Fingerprint, Shield, Link as LinkIcon } from "lucide-react";

interface BonapProvenance {
  source_id?: string;
  source_url?: string | null;
  method?: string;
  cache_status?: string;
  queried_at?: string;
  license?: string;
  rights?: string;
}

interface BonapMapEnvelope {
  found: boolean;
  provenance?: BonapProvenance;
}

export function ProvenancePanel({ response }: { response: BonapMapEnvelope }) {
  const prov = response.provenance;

  if (!prov) return null;

  return (
    <div className="bg-secondary/20 rounded-2xl border border-secondary p-6 md:p-8 space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Database className="w-4 h-4" /> Cache Status
          </div>
          <p className="text-foreground capitalize">{prov.cache_status ?? "—"}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Clock className="w-4 h-4" /> Queried At
          </div>
          <p className="text-foreground">
            {prov.queried_at ? new Date(prov.queried_at).toLocaleString() : "—"}
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Shield className="w-4 h-4" /> License
          </div>
          <p className="text-foreground text-sm">
            {prov.license ?? "—"}
          </p>
        </div>
      </div>

      {prov.rights && (
        <div className="space-y-2 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Fingerprint className="w-4 h-4" /> Rights
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{prov.rights}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
        {prov.source_id && (
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5"/> Source ID: {prov.source_id}
          </span>
        )}
        {prov.source_url && (
          <span className="flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5"/>
            <a href={prov.source_url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-primary truncate max-w-[300px]">
              {prov.source_url}
            </a>
          </span>
        )}
        {prov.method && (
          <span className="flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5"/> Method: {prov.method}
          </span>
        )}
      </div>

    </div>
  );
}

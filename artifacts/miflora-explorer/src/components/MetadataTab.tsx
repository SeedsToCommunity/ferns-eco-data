import { useGetMifloraMetadata } from "@workspace/api-client-react";
import type { MifloraMetadataResponse } from "@workspace/api-client-react";
import { Database, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";

export function MetadataTab() {
  const { data: response, isLoading, isError, error } = useGetMifloraMetadata();

  const meta = response as MifloraMetadataResponse | null | undefined;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Source Metadata</h2>
            <p className="text-xs text-muted-foreground">Michigan Flora registry information from FERNS</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 p-4 text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading metadata…
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{(error as Error)?.message ?? "Failed to load metadata"}</span>
        </div>
      )}

      {meta && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {[
              { label: "Service", value: meta.service_name },
              { label: "Source ID", value: meta.service_id },
              { label: "Permission", value: meta.permission_status },
              { label: "Website", value: meta.attribution?.website },
              { label: "API Base URL", value: meta.attribution?.api_base_url },
              { label: "License", value: meta.attribution?.license },
              { label: "Citation", value: meta.attribution?.citation },
            ].filter((f) => f.value != null).map((field) => (
              <div key={field.label} className="flex items-start gap-4 px-6 py-4">
                <span className="text-xs font-medium text-muted-foreground w-28 shrink-0 mt-0.5">
                  {field.label}
                </span>
                <span className="text-sm text-foreground break-words">
                  {typeof field.value === "string" && field.value.startsWith("http") ? (
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      {field.value}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    String(field.value)
                  )}
                </span>
              </div>
            ))}
          </div>

          {meta.registry_entry && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Registry Entry</h3>
              <div className="space-y-3">
                {meta.registry_entry.description && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                    <p className="text-sm text-foreground leading-relaxed">{meta.registry_entry.description}</p>
                  </div>
                )}
                {meta.registry_entry.known_limitations && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Known Limitations</p>
                    <p className="text-sm text-foreground leading-relaxed">{meta.registry_entry.known_limitations}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {meta.registry_entry.status && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium capitalize">
                        {meta.registry_entry.status}
                      </span>
                    </div>
                  )}
                  {meta.registry_entry.update_frequency && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Update Frequency</p>
                      <p className="text-xs text-foreground">{meta.registry_entry.update_frequency}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {response && (
        <RawJsonPanel title="Michigan Flora Metadata Response" data={response} />
      )}
    </div>
  );
}

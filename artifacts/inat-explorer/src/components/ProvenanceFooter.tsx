import { useGetInatMetadata } from "@workspace/api-client-react";

export function ProvenanceFooter() {
  const { data } = useGetInatMetadata();

  return (
    <footer className="border-t border-border bg-muted/40 py-3 px-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2 mt-auto">
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground/70">iNaturalist Source Explorer</span>
        <span className="text-border">•</span>
        <span>Part of FERNS Data Layer</span>
      </div>
      {data && (
        <div className="flex items-center gap-3">
          <span>Source: <span className="font-medium text-foreground/80">{data.source}</span></span>
          <span className="text-border">•</span>
          <span>License: {data.license}</span>
        </div>
      )}
    </footer>
  );
}

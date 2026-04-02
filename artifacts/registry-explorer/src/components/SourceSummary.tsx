import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MetadataShape {
  provenance?: {
    derivation_summary?: string;
    derivation_scientific?: string;
  };
}

interface SourceSummaryProps {
  metadataApiPath: string;
  fallback?: string;
  className?: string;
}

export function SourceSummary({ metadataApiPath, fallback, className }: SourceSummaryProps) {
  const [scientificOpen, setScientificOpen] = useState(false);

  const { data: meta, isLoading, isError } = useQuery<MetadataShape>({
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
      <div className={className}>
        <div className="h-4 bg-muted animate-pulse rounded mb-2 max-w-xl" />
        <div className="h-4 bg-muted animate-pulse rounded mb-2 max-w-2xl" />
        <div className="h-4 bg-muted animate-pulse rounded max-w-lg" />
      </div>
    );
  }

  if (isError) {
    if (fallback) return <p className={className}>{fallback}</p>;
    return null;
  }

  const summary = meta?.provenance?.derivation_summary;
  const scientific = meta?.provenance?.derivation_scientific;

  if (!summary) {
    if (fallback) return <p className={className}>{fallback}</p>;
    return null;
  }

  return (
    <div className={className}>
      <p>{summary}</p>
      {scientific && (
        <div className="mt-3">
          <button
            onClick={() => setScientificOpen((o) => !o)}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          >
            {scientificOpen ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            Scientific Description
          </button>
          {scientificOpen && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80 whitespace-pre-wrap border-l-2 border-border pl-3">
              {scientific}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

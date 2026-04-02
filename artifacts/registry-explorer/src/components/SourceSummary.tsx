import { useQuery } from "@tanstack/react-query";

interface MetadataShape {
  provenance?: {
    derivation_summary?: string;
  };
}

interface SourceSummaryProps {
  metadataApiPath: string;
  fallback?: string;
  className?: string;
}

export function SourceSummary({ metadataApiPath, fallback, className }: SourceSummaryProps) {
  const { data: meta, isLoading } = useQuery<MetadataShape>({
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

  const summary = meta?.provenance?.derivation_summary;

  if (!summary) {
    if (fallback) return <p className={className}>{fallback}</p>;
    return null;
  }

  return <p className={className}>{summary}</p>;
}

import { useParams } from "wouter";
import { useGetSourcesIndex, getGetSourcesIndexQueryKey } from "@workspace/api-client-react";
import { Loader2, ServerCrash } from "lucide-react";
import { SourceMetadataPanel } from "@/components/SourceMetadataPanel";
import MetadataPage from "./MetadataPage";

export default function GenericSourcePage() {
  const { sourceId } = useParams<{ sourceId: string }>();
  const { data: sourcesData, isLoading } = useGetSourcesIndex({
    query: { queryKey: getGetSourcesIndexQueryKey() },
  });
  const source = sourcesData?.data?.sources?.find((s) => s.source_id === sourceId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isLoading && !source) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-10 text-center max-w-md">
          <ServerCrash className="w-10 h-10 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-destructive mb-2">Source not found</h2>
          <p className="text-muted-foreground">
            No source with ID <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{sourceId}</code> is registered in this data layer.
          </p>
        </div>
      </div>
    );
  }

  return <MetadataPage />;
}

import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import { useBonapExplorer } from "@/hooks/use-bonap";
import { SearchForm } from "@/components/bonap/SearchForm";
import { ResultDisplay } from "@/components/bonap/ResultDisplay";

export function BonapPage() {
  const { handleSearch, mapQuery } = useBonapExplorer();

  return (
    <SourceExplorerLayout sourceId="bonap-napa">
      <section>
        <SearchForm
          onSearch={handleSearch}
          isLoading={mapQuery.isPending && mapQuery.fetchStatus !== "idle"}
        />
      </section>

      <section className="pt-4">
        <ResultDisplay
          isLoading={mapQuery.isPending && mapQuery.fetchStatus !== "idle"}
          error={mapQuery.error}
          response={mapQuery.data}
        />
      </section>
    </SourceExplorerLayout>
  );
}

export default BonapPage;

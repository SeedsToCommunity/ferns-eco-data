import { useState } from "react";
import {
  useGetBonapMap,
  useGetBonapMetadata,
  getGetBonapMapQueryKey,
  getGetBonapMetadataQueryKey,
  type GetBonapMapParams
} from "@workspace/api-client-react";

export function useBonapExplorer() {
  const [searchParams, setSearchParams] = useState<GetBonapMapParams | null>(null);

  const effectiveParams: GetBonapMapParams = searchParams ?? { genus: "" };

  const mapQuery = useGetBonapMap(
    effectiveParams,
    {
      query: {
        queryKey: getGetBonapMapQueryKey(effectiveParams),
        enabled: !!searchParams?.genus,
        retry: false,
      }
    }
  );

  const metadataQuery = useGetBonapMetadata({
    query: {
      queryKey: getGetBonapMetadataQueryKey(),
      staleTime: Infinity,
    }
  });

  const handleSearch = (params: GetBonapMapParams) => {
    setSearchParams(params);
  };

  return {
    searchParams,
    handleSearch,
    mapQuery,
    metadataQuery
  };
}

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
  const [submitCount, setSubmitCount] = useState(0);

  const effectiveParams: GetBonapMapParams = searchParams ?? { genus: "" };

  const mapQuery = useGetBonapMap(
    effectiveParams,
    {
      query: {
        queryKey: [...getGetBonapMapQueryKey(effectiveParams), submitCount],
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
    setSubmitCount((c) => c + 1);
  };

  return {
    searchParams,
    handleSearch,
    mapQuery,
    metadataQuery
  };
}

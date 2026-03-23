import { useState } from "react";
import { 
  useGetBonnapMap, 
  useGetBonnapMetadata,
  getGetBonnapMapQueryKey,
  getGetBonnapMetadataQueryKey,
  type GetBonnapMapParams
} from "@workspace/api-client-react";

export function useBonapExplorer() {
  const [searchParams, setSearchParams] = useState<GetBonnapMapParams | null>(null);

  const effectiveParams: GetBonnapMapParams = searchParams ?? { genus: "" };
  
  const mapQuery = useGetBonnapMap(
    effectiveParams,
    {
      query: {
        queryKey: getGetBonnapMapQueryKey(effectiveParams),
        enabled: !!searchParams?.genus,
        retry: false,
      }
    }
  );

  const metadataQuery = useGetBonnapMetadata({
    query: {
      queryKey: getGetBonnapMetadataQueryKey(),
      staleTime: Infinity,
    }
  });

  const handleSearch = (params: GetBonnapMapParams) => {
    setSearchParams(params);
  };

  return {
    searchParams,
    handleSearch,
    mapQuery,
    metadataQuery
  };
}

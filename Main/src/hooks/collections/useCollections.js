import { useQuery } from "@tanstack/react-query";
import { getCollectionsByDateRange } from "services/collections.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useCollections(params = {}) {
  return useQuery({
    queryKey: queryKeys.collections.list(params),
    queryFn: () => getCollectionsByDateRange(params),
    keepPreviousData: true,
  });
}

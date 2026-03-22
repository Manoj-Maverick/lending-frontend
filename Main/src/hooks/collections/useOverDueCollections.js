import { useQuery } from "@tanstack/react-query";
import { getOverdueCollections } from "services/collections.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useOverdueCollections(params = {}) {
  return useQuery({
    queryKey: queryKeys.collections.overdue(params),
    queryFn: () => getOverdueCollections(params),
    keepPreviousData: true,
  });
}

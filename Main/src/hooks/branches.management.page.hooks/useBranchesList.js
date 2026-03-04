import { useQuery } from "@tanstack/react-query";
import { fetchBranchesList } from "api/branch-management";
import { queryKeys } from "queries/queryKeys";
export function useBranchesList({ page, limit, search, status, sortBy }) {
  return useQuery({
    queryKey: queryKeys.branches.list({ page, limit, search, status, sortBy }),
    queryFn: () => {
      return fetchBranchesList({ page, limit, search, status, sortBy });
    },
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });
}

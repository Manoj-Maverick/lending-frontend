import { useQuery } from "@tanstack/react-query";
import { getBranchesList } from "services/branches.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useBranchesList({ page, limit, search, status, sortBy }) {
  return useQuery({
    queryKey: queryKeys.branches.list({ page, limit, search, status, sortBy }),
    queryFn: () => getBranchesList({ page, limit, search, status, sortBy }),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });
}

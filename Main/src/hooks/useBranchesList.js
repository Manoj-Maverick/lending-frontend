import { useQuery } from "@tanstack/react-query";
import { fetchBranchesList } from "api/branch-management";
export function useBranchesList({ page, limit, search, status, sortBy }) {
  console.log("p", page, limit, search, status, sortBy);
  return useQuery({
    queryKey: ["branchesList", { page, limit, search, status, sortBy }],
    queryFn: () => {
      return fetchBranchesList({ page, limit, search, status, sortBy });
    },
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });
}

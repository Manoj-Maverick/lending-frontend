import { useQuery } from "@tanstack/react-query";
import { getBranchComparison } from "services/dashboard.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useBranchComparison() {
  return useQuery({
    queryKey: queryKeys.dashboard.branchComparison,
    queryFn: getBranchComparison,
    staleTime: 60_000,
  });
}

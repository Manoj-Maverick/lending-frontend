import { useQuery } from "@tanstack/react-query";
import { getBranchPerformance } from "services/branchDetails.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useFetchBranchPerformanceMetricsByID(branchId) {
  return useQuery({
    queryKey: queryKeys.branches.metrics(branchId),
    queryFn: () => getBranchPerformance(branchId),
    enabled: !!branchId,
  });
}

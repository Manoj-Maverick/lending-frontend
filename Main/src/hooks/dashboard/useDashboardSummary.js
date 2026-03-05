import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "services/dashboard.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useDashboardSummary(branchId) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(branchId),
    queryFn: () => getDashboardSummary(branchId),
    staleTime: 60_000,
  });
}

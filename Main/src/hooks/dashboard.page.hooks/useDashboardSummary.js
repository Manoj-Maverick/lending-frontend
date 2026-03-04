import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "../../api/dashboard";
import { queryKeys } from "queries/queryKeys";

export function useDashboardSummary(branchId) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(branchId),
    queryFn: () => fetchDashboardSummary(branchId),
    staleTime: 60_000,
  });
}

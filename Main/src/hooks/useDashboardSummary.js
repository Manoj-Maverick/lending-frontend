import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "../api/dashboard";

export function useDashboardSummary(branchId) {
  return useQuery({
    queryKey: ["dashboard-summary", branchId ?? "all"],
    queryFn: () => fetchDashboardSummary(branchId),
    staleTime: 60_000,
  });
}

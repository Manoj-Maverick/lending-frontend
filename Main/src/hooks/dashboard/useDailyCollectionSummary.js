import { useQuery } from "@tanstack/react-query";
import { getDailyCollectionSummary } from "services/dashboard.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useDailyCollectionSummary(branchId) {
  return useQuery({
    queryKey: queryKeys.dashboard.dailyCollectionSummary(branchId),
    queryFn: () => getDailyCollectionSummary(branchId),
    staleTime: 60_000,
  });
}

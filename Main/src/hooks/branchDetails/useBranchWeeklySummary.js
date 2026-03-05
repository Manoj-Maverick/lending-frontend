import { useQuery } from "@tanstack/react-query";
import { getWeeklyLoanSummary } from "services/branchDetails.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useGetWeeklyLoanSummary(branchId) {
  return useQuery({
    queryKey: queryKeys.branches.weeklyLoanSummary(branchId),
    queryFn: () => getWeeklyLoanSummary(branchId),
    enabled: !!branchId,
    staleTime: 10000 * 60,
  });
}

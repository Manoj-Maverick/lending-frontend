import { useQuery } from "@tanstack/react-query";
import { getTodayPayments } from "services/dashboard.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useTodayPayments(branchId) {
  return useQuery({
    queryKey: queryKeys.dashboard.todayPayments(branchId),
    queryFn: () => getTodayPayments(branchId),
    staleTime: 60_000,
  });
}

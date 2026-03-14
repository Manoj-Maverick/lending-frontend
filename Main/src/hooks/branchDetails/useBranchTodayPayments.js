import { useQuery } from "@tanstack/react-query";
import { getBranchTodayPayments } from "services/branchDetails.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useBranchTodayPayments(branchId) {
  return useQuery({
    queryKey: queryKeys.branches.branchTodayPayments(branchId),
    queryFn: () => getBranchTodayPayments(branchId),
    staleTime: 60_000,
  });
}

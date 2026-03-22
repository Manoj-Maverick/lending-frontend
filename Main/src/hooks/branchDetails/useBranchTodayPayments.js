import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useBranchTodayPayments(branchId) {
  return useAppQuery(queryConfig.branches.branchTodayPayments(branchId));
}

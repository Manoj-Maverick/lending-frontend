import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useTodayPayments(branchId) {
  return useAppQuery(queryConfig.dashboard.todayPayments(branchId));
}

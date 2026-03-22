import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useDashboardSummary(branchId) {
  return useAppQuery(queryConfig.dashboard.summary(branchId));
}

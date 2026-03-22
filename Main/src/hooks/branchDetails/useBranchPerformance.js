import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useFetchBranchPerformanceMetricsByID(branchId) {
  return useAppQuery(queryConfig.branches.metrics(branchId));
}

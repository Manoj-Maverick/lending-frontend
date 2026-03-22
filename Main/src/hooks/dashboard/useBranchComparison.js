import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useBranchComparison() {
  return useAppQuery(queryConfig.dashboard.branchComparison);
}

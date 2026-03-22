import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useFetchBranchById(branchId) {
  return useAppQuery(queryConfig.branches.detail(branchId));
}

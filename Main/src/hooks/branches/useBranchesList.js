import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useBranchesList({ page, limit, search, status, sortBy }) {
  return useAppQuery(
    queryConfig.branches.list({ page, limit, search, status, sortBy }),
  );
}

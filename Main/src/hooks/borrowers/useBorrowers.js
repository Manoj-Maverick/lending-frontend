import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useBorrowers(filters = {}) {
  return useAppQuery(queryConfig.borrowers.list(filters));
}

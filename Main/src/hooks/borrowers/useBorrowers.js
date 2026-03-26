import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useBorrowers(filters = {}, options = {}) {
  return useAppQuery({
    ...queryConfig.borrowers.list(filters),
    ...options,
  });
}

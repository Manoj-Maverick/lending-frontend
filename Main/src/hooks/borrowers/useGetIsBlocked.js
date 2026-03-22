import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useGetISBlocked(borrowerId) {
  return useAppQuery(queryConfig.borrowers.isBlocked(borrowerId));
}

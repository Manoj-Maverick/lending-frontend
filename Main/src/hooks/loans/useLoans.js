import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useLoans(filters = {}) {
  return useAppQuery(queryConfig.loans.list(filters));
}

export function useLoanStats(branch) {
  return useAppQuery(queryConfig.loans.stats(branch));
}

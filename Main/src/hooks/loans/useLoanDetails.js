import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useLoanDetails(loanId) {
  return useAppQuery(queryConfig.loans.details(loanId));
}

export function useLoanSchedule(loanId) {
  return useAppQuery(queryConfig.loans.schedule(loanId));
}

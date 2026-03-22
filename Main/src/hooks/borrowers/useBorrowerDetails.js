import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useBorrowerDetails(borrowerId) {
  return useAppQuery(queryConfig.borrowers.profile(borrowerId));
}

export function useBorrowerLoans(borrowerId) {
  return useAppQuery(queryConfig.borrowers.loans(borrowerId));
}

export function useBorrowerGuarantors(borrowerId) {
  return useAppQuery(queryConfig.borrowers.guarantors(borrowerId));
}

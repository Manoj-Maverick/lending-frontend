import { useQuery } from "@tanstack/react-query";
import { getLoanDetails, getLoanSchedule } from "services/loans.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useLoanDetails(loanId) {
  return useQuery({
    queryKey: queryKeys.loans.detail(loanId),
    queryFn: () => getLoanDetails(loanId),
    enabled: !!loanId,
    staleTime: 30 * 1000,
  });
}

export function useLoanSchedule(loanId) {
  return useQuery({
    queryKey: queryKeys.loans.schedule(loanId),
    queryFn: () => getLoanSchedule(loanId),
    enabled: !!loanId,
    staleTime: 30 * 1000,
  });
}

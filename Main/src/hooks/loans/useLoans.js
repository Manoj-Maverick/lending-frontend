import { useQuery } from "@tanstack/react-query";
import { getLoans, getLoanStats } from "services/loans.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useLoans(filters = {}) {
  return useQuery({
    queryKey: queryKeys.loans.list(filters),
    queryFn: () => getLoans(filters),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });
}

export function useLoanStats(branch) {
  return useQuery({
    queryKey: queryKeys.loans.stats(branch),
    queryFn: () => getLoanStats(branch),
    staleTime: 60 * 1000,
  });
}

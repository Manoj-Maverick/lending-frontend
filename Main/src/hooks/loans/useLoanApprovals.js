import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "queryKeys/queryKeys";
import {
  getPendingLoanRequests,
  reviewLoanRequest,
} from "services/loans.service";

export function usePendingLoanRequests(enabled = true) {
  return useQuery({
    queryKey: queryKeys.loans.pendingRequests(),
    queryFn: getPendingLoanRequests,
    enabled,
    staleTime: 15 * 1000,
    refetchInterval: 20 * 1000,
  });
}

export function useReviewLoanRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewLoanRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.loans.pendingRequests(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}

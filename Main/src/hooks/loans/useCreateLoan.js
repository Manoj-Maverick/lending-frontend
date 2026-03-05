import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLoan } from "services/loans.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}

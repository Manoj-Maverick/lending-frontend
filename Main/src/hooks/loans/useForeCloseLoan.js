import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foreCloseLoan } from "services/loans.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useForeCloseLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => foreCloseLoan(payload),

    onSuccess: () => {
      // refresh loan list
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foreCloseLoan } from "services/loans.service";
import { getInvalidationKeys, runInvalidation } from "query/invalidate";

export function useForeCloseLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => foreCloseLoan(payload),

    onSuccess: (_, variables) => {
      runInvalidation(
        queryClient,
        getInvalidationKeys("loanUpdated", {
          loanId: variables?.loan_id,
          borrowerId: variables?.borrower_id,
        }),
      );
    },
  });
}

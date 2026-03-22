import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPayment } from "services/payments.service";
import { getInvalidationKeys, runInvalidation } from "query/invalidate";

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: (_, variables) => {
      runInvalidation(
        queryClient,
        getInvalidationKeys("paymentAdded", {
          loanId: variables?.loan_id,
          borrowerId: variables?.borrower_id,
        }),
      );
    },
  });
}

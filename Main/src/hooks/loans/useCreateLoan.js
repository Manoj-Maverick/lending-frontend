import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLoan } from "services/loans.service";
import { getInvalidationKeys, runInvalidation } from "query/invalidate";

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      runInvalidation(queryClient, getInvalidationKeys("loanCreated"));
    },
  });
}

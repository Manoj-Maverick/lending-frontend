import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBorrower } from "services/borrowers.service";
import { getInvalidationKeys, runInvalidation } from "query/invalidate";

export function useCreateBorrower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBorrower,
    onSuccess: () => {
      runInvalidation(queryClient, getInvalidationKeys("borrowerCreated"));
    },
  });
}

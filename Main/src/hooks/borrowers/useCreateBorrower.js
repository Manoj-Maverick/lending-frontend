import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBorrower } from "services/borrowers.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useCreateBorrower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBorrower,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}


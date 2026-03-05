import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch } from "services/branches.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}

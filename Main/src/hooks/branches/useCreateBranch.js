import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch } from "services/branches.service";
import { getInvalidationKeys, runInvalidation } from "query/invalidate";

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      runInvalidation(queryClient, getInvalidationKeys("branchCreated"));
    },
  });
}

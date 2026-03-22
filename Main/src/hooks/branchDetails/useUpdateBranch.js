import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBranch } from "services/branches.service";
import { getInvalidationKeys, runInvalidation } from "query/invalidate";

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { id, ...data } = payload;
      return updateBranch(id, data);
    },
    onSuccess: (_, variables) => {
      runInvalidation(
        queryClient,
        getInvalidationKeys("branchUpdated", { branchId: variables.id }),
      );
    },
  });
}

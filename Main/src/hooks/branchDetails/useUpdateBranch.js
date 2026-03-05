import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBranch } from "services/branches.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { id, ...data } = payload;
      return updateBranch(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.branches.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
    },
  });
}

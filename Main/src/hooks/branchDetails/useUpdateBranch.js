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
      const branchId = variables.id;

      // Invalidate specific branch detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.branches.detail(branchId),
      });

      // Invalidate all branch lists and related data
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.lists() });

      // Invalidate related branch detail pages
      queryClient.invalidateQueries({
        queryKey: queryKeys.branches.metrics(branchId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.branches.staff(branchId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.branches.customers(branchId),
      });

      // Invalidate dashboard since branch data affects overall stats
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}

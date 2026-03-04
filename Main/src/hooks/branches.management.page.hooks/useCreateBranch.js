import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/api/create-new-branch", data);
      return res.data;
    },

    onSuccess: () => {
      // Invalidate all branch lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.branches.lists(),
      });

      // Invalidate management dashboard if needed
      queryClient.invalidateQueries({
        queryKey: queryKeys.branches.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.all,
      });
    },
  });
};

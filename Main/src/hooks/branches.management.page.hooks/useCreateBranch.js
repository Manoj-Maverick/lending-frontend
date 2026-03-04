import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "queries/queryKeys";

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        "http://localhost:3001/api/create-new-branch",
        data,
      );
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

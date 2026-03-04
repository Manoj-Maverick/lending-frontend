// hooks/branches/useUpdateBranch.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { id, ...data } = payload;
      await axios.put(`http://localhost:3001/api/update-branch/${id}`, data, {
        withCredentials: true,
      });
    },
    onSuccess: (_, variables) => {
      // Refresh this branch everywhere
      queryClient.invalidateQueries(["branch", variables.id]);
      // If you have lists:
      queryClient.invalidateQueries(["branches"]);
    },
  });
}

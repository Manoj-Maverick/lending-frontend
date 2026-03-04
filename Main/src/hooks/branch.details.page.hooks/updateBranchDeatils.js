// hooks/branches/useUpdateBranch.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "api/client";

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { id, ...data } = payload;
      await api.put(`/api/update-branch/${id}`, data);
    },
    onSuccess: (_, variables) => {
      // Refresh this branch everywhere
      queryClient.invalidateQueries(["branch", variables.id]);
      // If you have lists:
      queryClient.invalidateQueries(["branches"]);
    },
  });
}

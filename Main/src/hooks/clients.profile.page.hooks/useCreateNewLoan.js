import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await api.post("/api/loans/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },

    onSuccess: () => {
      // refresh dashboard & loans list
      queryClient.invalidateQueries([queryKeys.dashboard.summary()]);
      queryClient.invalidateQueries([queryKeys.clients.all]);
    },
  });
};

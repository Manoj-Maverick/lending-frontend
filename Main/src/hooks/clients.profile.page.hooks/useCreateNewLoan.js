import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "queries/queryKeys";

export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        "http://localhost:3001/api/loans/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    },

    onSuccess: () => {
      // refresh dashboard & loans list
      queryClient.invalidateQueries([queryKeys.dashboard.summary()]);
      queryClient.invalidateQueries([queryKeys.clients.all]);
    },
  });
};

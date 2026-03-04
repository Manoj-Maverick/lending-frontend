import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

export const useAddPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/api/loans/record-payment", payload);
      return data;
    },

    onSuccess: () => {
      // refresh dashboard stats
      queryClient.invalidateQueries(queryKeys.dashboard.summary());

      // refresh loan details
      queryClient.invalidateQueries(queryKeys.loans.all);
    },
  });
};

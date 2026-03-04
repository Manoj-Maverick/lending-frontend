import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "queries/queryKeys";

export const useAddPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post(
        "http://localhost:3001/api/loans/record-payment",
        payload,
      );
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

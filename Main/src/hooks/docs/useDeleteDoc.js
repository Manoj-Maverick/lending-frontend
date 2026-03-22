import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "api/client";
import { queryKeys } from "queryKeys/queryKeys";

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, category, entity_id, loan_id }) => {
      const res = await apiClient.delete(`/api/documents/${id}`, {
        data: { category },
      });

      return res.data;
    },

    onSuccess: (_, variables) => {
      const { category, entity_id, loan_id } = variables;

      if (category === "customer") {
        queryClient.invalidateQueries({
          queryKey: queryKeys.documents.customer(entity_id),
        });
      }

      if (category === "guarantor") {
        queryClient.invalidateQueries({
          queryKey: queryKeys.documents.guarantor(entity_id),
        });
      }

      if (category === "loan") {
        queryClient.invalidateQueries({
          queryKey: queryKeys.documents.loan(loan_id),
        });
      }
    },
  });
};

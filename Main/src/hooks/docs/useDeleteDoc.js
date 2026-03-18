import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "api/client";

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, category }) => {
      const res = await apiClient.delete(`/api/documents/${id}`, {
        data: { category },
      });

      return res.data;
    },

    onSuccess: (_, variables) => {
      const { category, entity_id, loan_id } = variables;

      if (category === "customer") {
        queryClient.invalidateQueries({
          queryKey: ["documents", "customer", entity_id],
        });
      }

      if (category === "guarantor") {
        queryClient.invalidateQueries({
          queryKey: ["documents", "guarantor", entity_id],
        });
      }

      if (category === "loan") {
        queryClient.invalidateQueries({
          queryKey: ["documents", "loan", loan_id],
        });
      }
    },
  });
};

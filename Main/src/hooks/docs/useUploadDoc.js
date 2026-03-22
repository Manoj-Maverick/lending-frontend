import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "api/client";
import { queryKeys } from "queryKeys/queryKeys";

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      category,
      entity_id,
      loan_id,
      document_type,
      file,
    }) => {
      const formData = new FormData();

      formData.append("category", category);
      formData.append("entity_id", entity_id);
      formData.append("document_type", document_type);

      if (loan_id) formData.append("loan_id", loan_id);
      if (file) formData.append("file", file);
      console.log(formData);

      const res = await apiClient.post("/api/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

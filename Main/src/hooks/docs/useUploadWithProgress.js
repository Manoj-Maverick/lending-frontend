import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "queryKeys/queryKeys";
import apiClient from "api/client";
import { uploadToCloudinary } from "api/uploadToCloudinery.js";

export const useUploadWithProgress = () => {
  const queryClient = useQueryClient();

  const uploadDocument = useCallback(
    async ({
      file,
      category,
      document_type,
      entity_id,
      loan_id,
      onProgress,
    }) => {
      // 🚀 STEP 1: upload to cloudinary
      const cloudRes = await uploadToCloudinary({
        file,
        category,
        entity_id,
        loan_id,
        onProgress,
      });

      // 🚀 STEP 2: send metadata
      await apiClient.post("/api/documents", {
        category,
        entity_id,
        loan_id,
        document_type,
        file_url: cloudRes.secure_url,
        public_id: cloudRes.public_id,

        // 🔥 ADD THESE
        file_name: file.name,
        mime_type: file.type,
        file_size: cloudRes.bytes,
      });

      // 🔄 invalidate cache
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

      if (category === "staff") {
        queryClient.invalidateQueries({
          queryKey: queryKeys.documents.staff(entity_id),
        });
      }
    },
    [queryClient],
  );

  return { uploadDocument };
};

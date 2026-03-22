import { useCallback } from "react";
import { API_BASE_URL } from "api/client";
import { useUploadDocument } from "./useUploadDoc";

/**
 * Custom hook for uploading documents with progress tracking
 * Works across all document categories (customer, guarantor, loan)
 * Uses useUploadDocument hook for proper cache invalidation + XHR for progress tracking
 */
export const useUploadWithProgress = () => {
  const { mutateAsync: uploadDoc } = useUploadDocument();

  const uploadDocument = useCallback(
    async ({
      file,
      category,
      document_type,
      entity_id,
      loan_id,
      onProgress,
      signal,
    }) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        // Build form data based on category
        formData.append("file", file);
        formData.append("category", category);
        formData.append("document_type", document_type);

        if (entity_id) formData.append("entity_id", entity_id);
        if (loan_id) formData.append("loan_id", loan_id);

        // Track upload progress in real-time
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress(percentComplete);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            onProgress?.(100);

            // After successful XHR upload, call the mutation hook to trigger cache invalidation
            uploadDoc({
              category,
              entity_id,
              loan_id,
              document_type,
              file,
            })
              .then(() => resolve())
              .catch((err) => {
                // Upload succeeded but cache invalidation failed - still resolve
                console.warn("Cache invalidation failed:", err);
                resolve();
              });
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });

        // Handle abort signal for cancellation
        if (signal) {
          signal.addEventListener("abort", () => {
            xhr.abort();
          });
        }

        // Initialize progress
        onProgress?.(0);

        // POST to the documents API endpoint
        xhr.open("POST", `${API_BASE_URL}/api/documents`);
        xhr.send(formData);
      });
    },
    [uploadDoc],
  );

  return { uploadDocument };
};

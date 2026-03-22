import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "api/client";
import { useToast } from "context/ToastContext";
import { getInvalidationKeys, runInvalidation } from "query/invalidate";

export const useToggleBlock = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ borrowerId, isBlocked }) => {
      return apiClient.put(`/api/customers/${borrowerId}/block`, {
        isBlocked,
      });
    },

    onSuccess: (_, variables) => {
      const { borrowerId, isBlocked } = variables;
      runInvalidation(
        queryClient,
        getInvalidationKeys("borrowerUpdated", { borrowerId }),
      );

      showToast(
        isBlocked
          ? "Borrower blocked successfully"
          : "Borrower unblocked successfully",
        "success",
      );
    },

    onError: (error) => {
      showToast(
        error?.response?.data?.message || "Failed to update borrower status",
        "error",
      );
    },
  });
};

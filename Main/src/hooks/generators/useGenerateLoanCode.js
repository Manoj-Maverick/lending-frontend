import { useMutation } from "@tanstack/react-query";
import apiClient from "api/client";
export const useGenerateLoanCode = () => {
  return useMutation({
    mutationFn: async ({ customerCode }) => {
      const res = await apiClient.post("/api/generate-next-loan-code", {
        customerCode,
      });

      return res.data.loanCode;
    },
  });
};

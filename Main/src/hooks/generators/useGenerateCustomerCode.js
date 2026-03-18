import { useMutation } from "@tanstack/react-query";
import apiClient from "api/client";

export const useGenerateCustomerCode = () => {
  return useMutation({
    mutationFn: async ({ branchCode }) => {
      const res = await apiClient.post("/api/generate-next-customer-code", {
        branchCode,
      });
      return res.data.customerCode;
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import apiClient from "api/client";

export const useGenerateBranchCode = () => {
  return useMutation({
    mutationFn: async ({ branchType, district, area }) => {
      const res = await apiClient.post("/api/generate-next-branch-code", {
        branchType,
        district,
        area,
      });

      return res.data.branchCode;
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

async function fetchWeeklyLoanSummary(branchId) {
  try {
    const response = await api.get(
      `/api/branch-details/weekly-loan-summary/${branchId}`,
    );

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Failed to fetch weekly loan summary";
    throw new Error(message);
  }
}

export function useGetWeeklyLoanSummary(branchId) {
  return useQuery({
    queryKey: queryKeys.branches.weeklyLoanSummary(branchId),
    queryFn: () => fetchWeeklyLoanSummary(branchId),
    enabled: !!branchId,
    staleTime: 10000 * 60,
  });
}

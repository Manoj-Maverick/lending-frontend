import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchWeeklyLoanSummary(branchId) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/branch-details/weekly-loan-summary/${branchId}`,
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to fetch weekly loan summary";
      throw new Error(message);
    }

    throw new Error("Unexpected error while fetching weekly loan summary");
  }
}

export function useGetWeeklyLoanSummary(branchId) {
  return useQuery({
    queryKey: ["branch", branchId, "weekly-loan-summary"],
    queryFn: () => fetchWeeklyLoanSummary(branchId),
    enabled: !!branchId,
    staleTime: 10000 * 60,
  });
}

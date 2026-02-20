import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function fetchLoanSchedule(loanId) {
  if (!loanId) throw new Error("Loan ID is required");

  try {
    const res = await axios.get(
      `http://localhost:3001/api/loans/${loanId}/schedule`,
    );

    if (!res.data || res.data.success !== true) {
      throw new Error(res.data?.message || "Invalid API response");
    }

    return res.data.data; // array of schedule rows
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch loan schedule";
    throw new Error(message);
  }
}

export function useGetLoanSchedule(loanId) {
  return useQuery({
    queryKey: ["loan-schedule", loanId],
    queryFn: () => fetchLoanSchedule(loanId),
    enabled: !!loanId,
    staleTime: 1000 * 30,
  });
}

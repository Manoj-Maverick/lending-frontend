import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchLoanDetails(loanId) {
  if (!loanId) throw new Error("Loan ID is required");

  const res = await axios.get(
    `http://localhost:3001/api/loans/${loanId}/details`,
  );

  if (!res.data || res.data.success !== true) {
    throw new Error(res.data?.message || "Invalid API response");
  }

  return res.data.data;
}

export function useGetLoanDetails(loanId) {
  return useQuery({
    queryKey: ["loan-details", loanId],
    queryFn: () => fetchLoanDetails(loanId),
    enabled: !!loanId, // only run when id exists
    staleTime: 1000 * 30,
  });
}

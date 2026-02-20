import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch function:
 * Calls backend stats API and returns aggregated loan KPIs.
 */
export async function fetchLoansManagementStats({ branch }) {
  const params = {
    branch: branch ?? "all",
  };

  try {
    const res = await axios.get(
      "http://localhost:3001/api/loans-management/stats",
      { params },
    );

    if (!res.data || res.data.success !== true) {
      throw new Error(res.data?.message || "Invalid API response");
    }

    return res.data.data; // { active_loans, closed_loans, foreclosed_loans, total_disbursed, total_outstanding }
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch loan management stats";

    throw new Error(message);
  }
}

/**
 * React Query Hook
 * @param {Object} options
 * @param {string|number} options.branch - "all" or branch_id
 */
export function useLoansManagementStats({ branch }) {
  return useQuery({
    queryKey: ["loans-management-stats", branch ?? "all"],
    queryFn: () => fetchLoansManagementStats({ branch }),
    keepPreviousData: true,
    staleTime: 1000 * 60, // 1 minute cache is fine for stats
  });
}

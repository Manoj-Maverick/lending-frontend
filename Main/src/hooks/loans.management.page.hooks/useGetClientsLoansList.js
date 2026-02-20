import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch function
 * @param {Object} filters
 *  - status
 *  - branch
 *  - searchQuery
 *  - loanType
 *  - page
 *  - pageSize
 */
export async function fetchClientsLoansList(filters) {
  const params = {
    status: filters.status,
    branch: filters.branch,
    search: filters.searchQuery,
    loanType: filters.loanType, // not used in backend yet
    page: filters.page,
    pageSize: filters.pageSize,
  };

  try {
    const res = await axios.get(
      "http://localhost:3001/api/loans-management/loans-list",
      { params },
    );

    if (!res.data || res.data.success !== true) {
      throw new Error(res.data?.message || "Invalid API response");
    }

    // Now return FULL response: { data, pagination }
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch loans list";
    throw new Error(message);
  }
}

/**
 * React Query Hook
 */
export function useClientsLoansList(filters) {
  return useQuery({
    queryKey: [
      "clients-loans-list",
      filters.status,
      filters.branch,
      filters.searchQuery,
      filters.loanType,
      filters.page,
      filters.pageSize,
    ],
    queryFn: () => fetchClientsLoansList(filters),
    keepPreviousData: true, // smooth pagination UX
    staleTime: 1000 * 30,
  });
}

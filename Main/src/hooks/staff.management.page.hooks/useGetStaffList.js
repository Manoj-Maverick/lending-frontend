import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * -------------------------------
 * Fetch function: calls backend
 * -------------------------------
 * @param {Object} params
 *  - search
 *  - branch
 *  - role
 *  - sortKey
 *  - sortDir
 *  - page
 *  - pageSize
 */
export async function fetchStaffList(params) {
  const {
    search = "",
    branch = "all",
    role = "all",
    sortKey = "name",
    sortDir = "asc",
    page = 1,
    pageSize = 10,
  } = params || {};

  try {
    const res = await axios.get(
      "http://localhost:3001/api/staffs-management/staffs-list",
      {
        params: {
          search,
          branch,
          role,
          sortKey,
          sortDir,
          page,
          pageSize,
        },
      },
    );

    if (!res.data || res.data.success !== true) {
      throw new Error(res.data?.message || "Invalid API response");
    }

    // Expected backend shape:
    // {
    //   success: true,
    //   data: [...rows],
    //   pagination: { page, pageSize, total }
    // }

    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch staff list";
    throw new Error(message);
  }
}

/**
 * --------------------------------
 * React Query Hook
 * --------------------------------
 * @param {Object} params
 */
export function useGetStaffList(params) {
  return useQuery({
    queryKey: ["staff-list", params],
    queryFn: () => fetchStaffList(params),
    keepPreviousData: true, // 👈 important for pagination UX
    staleTime: 1000 * 60 * 10, // 30 seconds
  });
}

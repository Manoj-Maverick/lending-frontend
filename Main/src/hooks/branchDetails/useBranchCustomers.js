import { useQuery } from "@tanstack/react-query";
import { getBranchCustomers } from "services/branchDetails.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useFetchBranchCustomers({
  branchId,
  search = "",
  status = "all",
  blockStatus = "all",
  sortKey = "name",
  sortDir = "asc",
  page = 1,
  pageSize = 5,
}) {
  return useQuery({
    queryKey: [
      ...queryKeys.branches.customers(branchId),
      {
        search,
        status,
        blockStatus,
        sortKey,
        sortDir,
        page,
        pageSize,
      },
    ],

    queryFn: async () => {
      const res = await getBranchCustomers({
        branchId,
        search,
        status,
        blockStatus,
        sortKey,
        sortDir,
        page,
        pageSize,
      });

      // 🔥 normalize response (VERY IMPORTANT)
      return res;
    },
    

    enabled: !!branchId,

    // 🔥 smooth pagination UX
    placeholderData: (prev) => prev,

    // ⚡ performance tuning
    staleTime: 1000 * 30, // 30 sec cache
    gcTime: 1000 * 60 * 5, // keep cache 5 min
  });
}
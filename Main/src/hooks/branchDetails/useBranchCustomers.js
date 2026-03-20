import { useQuery } from "@tanstack/react-query";
import { getBranchCustomers } from "services/branchDetails.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useFetchBranchCustomers({
  branchId,
  search = "",
  status = "all",
  sortKey = "name",
  sortDir = "asc",
  page = 1,
  pageSize = 5,
  blockStatus = "all",
}) {
  return useQuery({
    queryKey: queryKeys.branches.customers(branchId, {
      search,
      status,
      sortKey,
      sortDir,
      page,
      pageSize,
      blockStatus,
    }),
    queryFn: () =>
      getBranchCustomers({
        branchId,
        search,
        status,
        sortKey,
        sortDir,
        page,
        pageSize,
        blockStatus,
      }),
    enabled: !!branchId,
    keepPreviousData: true,
  });
}

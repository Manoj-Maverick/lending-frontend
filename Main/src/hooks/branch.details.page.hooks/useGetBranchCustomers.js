import { useQuery } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

async function fetchBranchCustomers({
  branchId,
  search = "",
  status = "all",
  sortKey = "name",
  sortDir = "asc",
  page = 1,
  pageSize = 5,
}) {
  const res = await api.get(`/api/branch-details/customers/${branchId}`, {
    params: {
      search,
      status,
      sortKey,
      sortDir,
      page,
      pageSize,
    },
  });

  if (res.status !== 200) {
    throw new Error("Failed to load branch customers");
  }

  console.log("res.data", res.data);
  return res.data;
}

export function useFetchBranchCustomers({
  branchId,
  search = "",
  status = "all",
  sortKey = "name",
  sortDir = "asc",
  page = 1,
  pageSize = 5,
}) {
  return useQuery({
    queryKey: queryKeys.branches.customers(branchId, {
      search,
      status,
      sortKey,
      sortDir,
      page,
      pageSize,
    }),
    queryFn: () =>
      fetchBranchCustomers({
        branchId,
        search,
        status,
        sortKey,
        sortDir,
        page,
        pageSize,
      }),
    enabled: !!branchId,
    keepPreviousData: true, // helps smooth pagination
  });
}

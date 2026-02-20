import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchBranchCustomers({
  branchId,
  search = "",
  status = "all",
  sortKey = "name",
  sortDir = "asc",
  page = 1,
  pageSize = 5,
}) {
  const res = await axios.get(
    `http://localhost:3001/api/branch-details/customers/${branchId}`,
    {
      params: {
        search,
        status,
        sortKey,
        sortDir,
        page,
        pageSize,
      },
    },
  );

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
    queryKey: [
      "branch",
      branchId,
      "customers",
      search,
      status,
      sortKey,
      sortDir,
      page,
      pageSize,
    ],
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

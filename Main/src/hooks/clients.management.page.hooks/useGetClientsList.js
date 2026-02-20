import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchClientsList({
  search = "",
  branchId = null,
  status = "all",
  blockStatus = "all",
  sortKey = "name",
  sortDir = "asc",
  page = 1,
  pageSize = 10,
}) {
  const res = await axios.get(
    "http://localhost:3001/api/clients-management/clients-list",
    {
      params: {
        search,
        branchId,
        status,
        blockStatus,
        sortKey,
        sortDir,
        page,
        pageSize,
      },
    },
  );

  if (res.status !== 200) {
    throw new Error("Failed to load clients list");
  }

  return res.data;
}

export function useGetClientsList(params) {
  return useQuery({
    queryKey: ["clients-list", params],
    queryFn: () => fetchClientsList(params),
    keepPreviousData: true, // ⭐ smooth pagination (no UI flicker)
  });
}

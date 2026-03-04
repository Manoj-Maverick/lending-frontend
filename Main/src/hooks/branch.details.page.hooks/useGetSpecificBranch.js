import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "queries/queryKeys";

async function fetchBranchById(branchId) {
  const res = await axios.get(
    `http://localhost:3001/api/branch-details/${branchId}`,
  );
  if (res.status !== 200) {
    throw new Error("Failed to load branches");
  }
  console.log(res.data);
  return res.data;
}

export function useFetchBranchById(branchId) {
  return useQuery({
    queryKey: queryKeys.branches.detail(branchId),
    queryFn: () => fetchBranchById(branchId),
    enabled: !!branchId,
  });
}

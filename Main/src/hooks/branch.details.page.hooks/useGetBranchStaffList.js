import { useQuery } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

async function fetchBranchStaffListById(branchId) {
  const res = await api.get(`/api/branch-details/staffList/${branchId}`);
  if (res.status !== 200) {
    throw new Error("Failed to load branches");
  }
  console.log("res.data", res.data, `/api/branch-details/staffList/${branchId}`);
  return res.data;
}

export function useFetchBranchStaffListById(branchId) {
  return useQuery({
    queryKey: queryKeys.branches.staff(branchId),
    queryFn: () => fetchBranchStaffListById(branchId),
    enabled: !!branchId,
  });
}

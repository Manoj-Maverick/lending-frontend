import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchBranchStaffListById(branchId) {
  const res = await axios.get(
    `http://localhost:3001/api/branch-details/staffList/${branchId}`,
  );
  if (res.status !== 200) {
    throw new Error("Failed to load branches");
  }
  console.log(
    "res.data",
    res.data,
    `http://localhost:3001/api/branch-details/staffList/${branchId}`,
  );
  return res.data;
}

export function useFetchBranchStaffListById(branchId) {
  return useQuery({
    queryKey: ["branch", branchId, "staff"],
    queryFn: () => fetchBranchStaffListById(branchId),
    enabled: !!branchId,
  });
}

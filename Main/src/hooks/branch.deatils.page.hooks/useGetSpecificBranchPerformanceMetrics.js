import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchBranchPerformanceMetricsByID(branchId) {
  const res = await axios.get(
    `http://localhost:3001/api/branch-details/performance-metrics/${branchId}`,
  );
  if (res.status !== 200) {
    throw new Error("Failed to load branches");
  }
  console.log(res.data);
  return res.data;
}

export function useFetchBranchPerformanceMetricsByID(branchId) {
  return useQuery({
    queryKey: ["branch", branchId, "metrics"],
    queryFn: () => fetchBranchPerformanceMetricsByID(branchId),
    enabled: !!branchId,
  });
}

import { useQuery } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

async function fetchBranchPerformanceMetricsByID(branchId) {
  const res = await api.get(
    `/api/branch-details/performance-metrics/${branchId}`,
  );
  if (res.status !== 200) {
    throw new Error("Failed to load branches");
  }
  console.log(res.data);
  return res.data;
}

export function useFetchBranchPerformanceMetricsByID(branchId) {
  return useQuery({
    queryKey: queryKeys.branches.metrics(branchId),
    queryFn: () => fetchBranchPerformanceMetricsByID(branchId),
    enabled: !!branchId,
  });
}

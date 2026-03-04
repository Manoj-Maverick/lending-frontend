import { useQuery } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

async function fetchBranches(branchId) {
  const res = await api.get("/api/branches", {
    params: branchId == null ? undefined : { branch: branchId },
  });

  if (res.status !== 200) {
    throw new Error("Failed to load branches");
  }

  return res.data;
}

export function useBranches(user, authLoading) {
  const branchId = user?.role === "ADMIN" ? null : user?.branchId;

  return useQuery({
    queryKey: queryKeys.branches.options(branchId),
    queryFn: () => fetchBranches(branchId),
    enabled: !authLoading && !!user, // 🔑 KEY LINE
    staleTime: 5 * 60 * 1000,
  });
}

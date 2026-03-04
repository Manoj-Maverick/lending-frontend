import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "queries/queryKeys";

async function fetchBranches(branchId) {
  const url =
    branchId == null
      ? "http://localhost:3001/api/branches"
      : `http://localhost:3001/api/branches?branch=${branchId}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load branches");
  }
  return res.json();
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

import { useQuery } from "@tanstack/react-query";
import { getBranchesOptions } from "services/branches.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useBranches(user, authLoading) {
  const branchId = user?.role === "ADMIN" ? null : user?.branchId;

  return useQuery({
    queryKey: queryKeys.branches.options(branchId),
    queryFn: () => getBranchesOptions(branchId),
    enabled: !authLoading && !!user,
    staleTime: 5 * 60 * 1000,
  });
}

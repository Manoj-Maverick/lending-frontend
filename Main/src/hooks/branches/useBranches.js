import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useBranches(user, authLoading) {
  const branchId = user?.role === "ADMIN" ? null : user?.branchId;

  return useAppQuery(
    queryConfig.branches.options({
      branchId,
      enabled: !authLoading && !!user,
    }),
  );
}

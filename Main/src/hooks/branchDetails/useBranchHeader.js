import { useQuery } from "@tanstack/react-query";
import { getBranchById } from "services/branchDetails.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useFetchBranchById(branchId) {
  return useQuery({
    queryKey: queryKeys.branches.detail(branchId),
    queryFn: () => getBranchById(branchId),
    enabled: !!branchId,
  });
}

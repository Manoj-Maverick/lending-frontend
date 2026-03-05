import { useQuery } from "@tanstack/react-query";
import { getBranchStaff } from "services/branchDetails.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useFetchBranchStaffListById(branchId) {
  return useQuery({
    queryKey: queryKeys.branches.staff(branchId),
    queryFn: () => getBranchStaff(branchId),
    enabled: !!branchId,
  });
}

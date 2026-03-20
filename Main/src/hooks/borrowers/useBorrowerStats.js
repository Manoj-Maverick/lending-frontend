import { useQuery } from "@tanstack/react-query";
import { getBorrowerStats } from "services/borrowers.service";
import { queryKeys } from "queryKeys/queryKeys";
export const useBorrowerStats = (branchId) => {
  return useQuery({
    queryKey: queryKeys.borrowers.stats(branchId),
    queryFn: () => getBorrowerStats({ branchId }),
    staleTime: 1000 * 60 * 5,
  });
};

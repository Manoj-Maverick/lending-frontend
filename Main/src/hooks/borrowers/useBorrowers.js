import { useQuery } from "@tanstack/react-query";
import { getBorrowers } from "services/borrowers.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useBorrowers(filters = {}) {
  return useQuery({
    queryKey: queryKeys.borrowers.list(filters),
    queryFn: () => getBorrowers(filters),
    keepPreviousData: true,
  });
}


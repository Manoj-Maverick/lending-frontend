import { useQuery } from "@tanstack/react-query";
import { getIsBlocked } from "services/borrowers.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useGetISBlocked(borrowerId) {
  return useQuery({
    queryKey: queryKeys.borrowers.isBlocked(borrowerId),
    queryFn: () => getIsBlocked(borrowerId),
    enabled: !!borrowerId,
  });
}

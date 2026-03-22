import { useQuery } from "@tanstack/react-query";
import { getOverdueCount } from "services/collections.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useOverdueCount(params = {}) {
  return useQuery({
    queryKey: queryKeys.collections.overdueCount(params),
    queryFn: () => getOverdueCount(params),

    // 🔥 REAL-TIME FEEL
    refetchInterval: 30000, // every 30 sec
    refetchOnWindowFocus: true,

    staleTime: 1000 * 20, // 20 sec cache
  });
}

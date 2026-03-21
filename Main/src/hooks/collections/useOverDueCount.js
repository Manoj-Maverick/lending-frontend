import { useQuery } from "@tanstack/react-query";
import { getOverdueCount } from "services/collections.service";

export function useOverdueCount(params = {}) {
  return useQuery({
    queryKey: ["overdue-count", params],
    queryFn: () => getOverdueCount(params),

    // 🔥 REAL-TIME FEEL
    refetchInterval: 30000, // every 30 sec
    refetchOnWindowFocus: true,

    staleTime: 1000 * 20, // 20 sec cache
  });
}

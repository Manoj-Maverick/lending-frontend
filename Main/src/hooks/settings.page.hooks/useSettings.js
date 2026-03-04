import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "../../api/settings";
import { queryKeys } from "queries/queryKeys";

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.app(),
    queryFn: fetchSettings,
    staleTime: 10 * 60_000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

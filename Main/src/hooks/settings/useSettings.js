import { useQuery } from "@tanstack/react-query";
import { getSettings } from "services/settings.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.app(),
    queryFn: getSettings,
    staleTime: 10 * 60_000,
    refetchOnWindowFocus: false,
  });
}

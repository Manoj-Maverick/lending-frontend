import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "../../api/settings";

export function useSettings() {
  return useQuery({
    queryKey: ["app-settings"],
    queryFn: fetchSettings,
    staleTime: 10 * 60_000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "services/settings.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useUsers(enabled) {
  return useQuery({
    queryKey: queryKeys.auth.users(),
    queryFn: getUsers,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

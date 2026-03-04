import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "api/settings";
import { queryKeys } from "queries/queryKeys";

export function useUsers(enabled) {
  return useQuery({
    queryKey: queryKeys.auth.users(),
    queryFn: fetchUsers,
    enabled, // 🔥 key part
    staleTime: 5 * 60 * 1000,
  });
}

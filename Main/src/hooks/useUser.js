import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "api/settings";

export function useUsers(enabled) {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled, // 🔥 key part
    staleTime: 5 * 60 * 1000,
  });
}

import { useQuery } from "@tanstack/react-query";
import { getStaffList } from "services/staff.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useGetStaffList(params) {
  return useQuery({
    queryKey: queryKeys.staff.list(params),
    queryFn: () => getStaffList(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 10,
  });
}

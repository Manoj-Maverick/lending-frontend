import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStaffSalary, saveStaffSalary } from "services/staffSalary.service";

export function useStaffSalary(filters) {
  return useQuery({
    queryKey: ["staff-salary", filters],
    queryFn: () => getStaffSalary(filters),
    staleTime: 1000 * 30,
  });
}

export function useSaveStaffSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveStaffSalary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-salary"] });
    },
  });
}

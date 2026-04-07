import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "services/expenses.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useExpenses(filters) {
  return useQuery({
    queryKey: queryKeys.expenses.list(filters),
    queryFn: () => getExpenses(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
}

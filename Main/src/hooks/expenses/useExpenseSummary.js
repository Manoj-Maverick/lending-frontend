import { useQuery } from "@tanstack/react-query";
import { getExpenseSummary } from "services/expenses.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useExpenseSummary(filters) {
  return useQuery({
    queryKey: queryKeys.expenses.summary(filters),
    queryFn: () => getExpenseSummary(filters),
    staleTime: 1000 * 30,
  });
}

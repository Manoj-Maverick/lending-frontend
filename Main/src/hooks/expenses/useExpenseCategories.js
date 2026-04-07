import { useQuery } from "@tanstack/react-query";
import { getExpenseCategories } from "services/expenses.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useExpenseCategories() {
  return useQuery({
    queryKey: queryKeys.expenses.categories(),
    queryFn: getExpenseCategories,
    staleTime: 1000 * 60 * 10,
  });
}

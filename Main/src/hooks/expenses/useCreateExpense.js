import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "services/expenses.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
    },
  });
}

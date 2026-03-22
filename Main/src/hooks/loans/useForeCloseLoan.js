import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foreCloseLoan } from "services/loans.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useForeCloseLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => foreCloseLoan(payload),

    onSuccess: (_, variables) => {
      // Invalidate loan data - list and all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });

      // Invalidate borrower data - loan count and loan lists affected
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowers.all });

      // If we have the borrower ID from variables, specifically invalidate that borrower's loans
      if (variables?.borrower_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.borrowers.loans(variables.borrower_id),
        });
      }

      // Invalidate dashboard stats - total loans, loan status distribution changed
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });

      // Invalidate collections - overdue status may have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
    },
  });
}

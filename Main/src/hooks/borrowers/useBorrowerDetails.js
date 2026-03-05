import { useQuery } from "@tanstack/react-query";
import {
  getBorrowerById,
  getBorrowerGuarantors,
  getBorrowerLoans,
} from "services/borrowers.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useBorrowerDetails(borrowerId) {
  return useQuery({
    queryKey: queryKeys.borrowers.profile(borrowerId),
    queryFn: () => getBorrowerById(borrowerId),
    enabled: !!borrowerId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBorrowerLoans(borrowerId) {
  return useQuery({
    queryKey: queryKeys.borrowers.loans(borrowerId),
    queryFn: () => getBorrowerLoans(borrowerId),
    enabled: !!borrowerId,
  });
}

export function useBorrowerGuarantors(borrowerId) {
  return useQuery({
    queryKey: queryKeys.borrowers.guarantors(borrowerId),
    queryFn: () => getBorrowerGuarantors(borrowerId),
    enabled: !!borrowerId,
  });
}


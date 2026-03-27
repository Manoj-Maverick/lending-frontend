import { useMutation } from "@tanstack/react-query";
import {
  generateLoanAgreement,
  generateLoanStatement,
} from "services/loans.service";

export function useGenerateLoanAgreement() {
  return useMutation({
    mutationFn: generateLoanAgreement,
  });
}

export function useGenerateLoanStatement() {
  return useMutation({
    mutationFn: generateLoanStatement,
  });
}

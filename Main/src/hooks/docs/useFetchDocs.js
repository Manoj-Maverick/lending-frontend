import { useQuery } from "@tanstack/react-query";
import apiClient from "api/client";

export const useCustomerDocuments = (customerId) => {
  return useQuery({
    queryKey: ["documents", "customer", customerId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/documents/customer/${customerId}`);

      return res.data.data;
    },
    enabled: !!customerId,
  });
};

export const useGuarantorDocuments = (guarantorId) => {
  return useQuery({
    queryKey: ["documents", "guarantor", guarantorId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/documents/guarantor/${guarantorId}`,
      );

      return res.data.data;
    },
    enabled: !!guarantorId,
  });
};

export const useLoanDocuments = (loanId) => {
  return useQuery({
    queryKey: ["documents", "loan", loanId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/documents/loan/${loanId}`);

      return res.data.data;
    },
    enabled: !!loanId,
  });
};

export const useStaffDocuments = (staffId) => {
  return useQuery({
    queryKey: ["documents", "staff", staffId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/documents/staff/${staffId}`);

      return res.data.data;
    },
    enabled: !!staffId,
  });
};

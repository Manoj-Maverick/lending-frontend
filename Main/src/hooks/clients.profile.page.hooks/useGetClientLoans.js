import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch function:
 * - Calls backend
 * - Validates response
 * - Returns { loans, stats }
 */
export async function fetchCustomerLoans(customerId) {
  if (!customerId) {
    throw new Error("customerId is required");
  }

  try {
    const res = await axios.get(
      `http://localhost:3001/api/client-profile/${customerId}/loans`,
    );

    if (!res.data || res.data.success !== true) {
      throw new Error(res.data?.message || "Invalid API response");
    }

    return res.data.data; // { loans, stats }
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch customer loans";

    throw new Error(message);
  }
}

/**
 * React Query Hook
 */
export function useCustomerLoans(customerId) {
  return useQuery({
    queryKey: ["customer-loans", customerId],
    enabled: !!customerId,
    queryFn: () => fetchCustomerLoans(customerId),
    staleTime: 1000 * 30,
  });
}

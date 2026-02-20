import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * API function: Fetch guarantors for a customer
 *
 * What it does:
 * - Calls backend endpoint to get guarantors of a customer
 * - Returns array of guarantors
 *
 * Throws:
 * - Throws error if request fails (React Query will handle it)
 */
const fetchGuarantors = async (customerId) => {
  if (!customerId) {
    throw new Error("customerId is required to fetch guarantors");
  }

  const res = await axios.get(
    `http://localhost:3001/api/client-profile/${customerId}/guarantors`,
  );

  // Backend format: { success: boolean, data: [...] }
  if (!res.data || res.data.success !== true) {
    throw new Error(res.data?.message || "Failed to fetch guarantors");
  }

  return res.data.data;
};

/**
 * React Query hook: useGuarantors
 *
 * What it does:
 * - Uses React Query to fetch & cache guarantors by customerId
 * - Refetches automatically when customerId changes
 * - Provides loading, error, data states
 */
export const useGuarantors = (customerId) => {
  return useQuery({
    queryKey: ["guarantors", customerId],
    queryFn: () => fetchGuarantors(customerId),
    enabled: !!customerId, // only run when customerId is truthy
  });
};

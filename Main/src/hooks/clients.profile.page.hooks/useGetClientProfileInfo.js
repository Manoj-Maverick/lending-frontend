import { useQuery } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

/**
 * Fetch customer profile from backend
 * -----------------------------------
 * Calls:
 *   GET /api/customers/:id/profile
 *
 * Returns JSON shaped for PersonalInfoTab component.
 */
async function fetchCustomerProfile(customerId) {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  try {
    const { data } = await api.get(`/api/client-profile/${customerId}/profile`);
    return data;
  } catch (error) {
    if (error?.response?.status === 404) {
      throw new Error("Customer not found");
    }

    throw new Error("Failed to load customer profile");
  }
}

/**
 * React Query hook to load customer profile
 * -----------------------------------------
 * - Caches by customerId
 * - Won't run until customerId is available
 * - Handles loading / error states automatically
 */
export function useCustomerProfile(customerId) {
  return useQuery({
    queryKey: queryKeys.clients.profile(customerId),
    queryFn: () => fetchCustomerProfile(customerId),
    enabled: !!customerId, // only run when id exists
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
}

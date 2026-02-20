import { useQuery } from "@tanstack/react-query";

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

  const res = await fetch(
    `http://localhost:3001/api/client-profile/${customerId}/profile`,
  );

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Customer not found");
    }
    throw new Error("Failed to load customer profile");
  }

  return res.json();
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
    queryKey: ["customer-profile", customerId],
    queryFn: () => fetchCustomerProfile(customerId),
    enabled: !!customerId, // only run when id exists
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";

/**
 * Sends FormData to backend to create a new client
 * @param {FormData} formData
 * @returns {Promise<object>} response data
 */
export async function createClient(formData) {
  try {
    const res = await api.post("/api/clients/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    // Axios wraps errors, so we can extract useful info
    if (error.response) {
      // Server responded with a status outside 2xx
      throw new Error(
        `Server Error (${error.response.status}): ${
          error.response.data?.message || "Unknown error"
        }`,
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something else happened while setting up the request
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => createClient(formData),

    onSuccess: () => {
      // ✅ Invalidate clients list so UI refreshes
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });

      // You can also return data to caller
      // e.g. { customerId, ... }
    },

    onError: (error) => {
      console.error("Create client failed:", error);
    },
  });
}

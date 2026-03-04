import { useQuery } from "@tanstack/react-query";
import api from "api/client";
import { queryKeys } from "queries/queryKeys";
export const useCollections = (params) => {
  return useQuery({
    queryKey: queryKeys.TodaysCollection.data(
      params?.branch_id,
      params?.start_date,
      params?.end_date,
    ),

    queryFn: async () => {
      const { data } = await api.get("/api/today-collections", {
        params,
      });

      return data;
    },

    keepPreviousData: true,
  });
};

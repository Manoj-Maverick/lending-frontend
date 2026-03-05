import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSettings } from "services/settings.service";
import { batchInvalidateQueries } from "queries/queryClientUtils";
import { queryKeys } from "queryKeys/queryKeys";

export function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSettings,
    onSuccess: async () => {
      await batchInvalidateQueries(queryClient, [queryKeys.settings.app()]);
    },
  });
}

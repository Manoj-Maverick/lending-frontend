import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSettings } from "services/settings.service";
import { getInvalidationKeys, runInvalidation } from "query/invalidate";

export function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      runInvalidation(queryClient, getInvalidationKeys("settingsSaved"));
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSettings } from "api/settings";

export function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

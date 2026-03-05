import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, disableUser } from "services/settings.service";
import { batchInvalidateQueries } from "queries/queryClientUtils";
import { queryKeys } from "queryKeys/queryKeys";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await batchInvalidateQueries(queryClient, [queryKeys.auth.users()]);
    },
  });
}

export function useDisableUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableUser,
    onSuccess: async () => {
      await batchInvalidateQueries(queryClient, [queryKeys.auth.users()]);
    },
  });
}

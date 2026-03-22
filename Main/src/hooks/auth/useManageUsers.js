import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, disableUser } from "services/settings.service";
import { getInvalidationKeys, runInvalidation } from "query/invalidate";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      runInvalidation(queryClient, getInvalidationKeys("usersUpdated"));
    },
  });
}

export function useDisableUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableUser,
    onSuccess: () => {
      runInvalidation(queryClient, getInvalidationKeys("usersUpdated"));
    },
  });
}

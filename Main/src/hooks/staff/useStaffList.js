import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStaff,
  deleteStaff,
  getStaffAttendance,
  getStaffDetail,
  getStaffList,
  saveStaffAttendance,
  updateStaff,
} from "services/staff.service";
import { queryKeys } from "queryKeys/queryKeys";

export function useGetStaffList(params) {
  return useQuery({
    queryKey: queryKeys.staff.list(params),
    queryFn: () => getStaffList(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
    },
  });
}

export function useStaffDetail(staffId, enabled = true) {
  return useQuery({
    queryKey: queryKeys.staff.detail(staffId),
    queryFn: () => getStaffDetail(staffId),
    enabled: Boolean(staffId) && enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useStaffAttendance(staffId, month, enabled = true) {
  return useQuery({
    queryKey: queryKeys.staff.attendance(staffId, month),
    queryFn: () => getStaffAttendance(staffId, month),
    enabled: Boolean(staffId) && enabled,
    staleTime: 1000 * 60,
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => updateStaff(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
    },
  });
}

export function useSaveStaffAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => saveStaffAttendance(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.staff.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: ["staff", "attendance", variables.id],
      });
    },
  });
}
